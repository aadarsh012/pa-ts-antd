// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import BN from 'bn.js';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { chainProperties } from 'src/global/networkConstants';
import subscanApiHeaders from 'src/global/subscanApiHeaders';
import { useFetch } from 'src/hooks';
import { LoadingStatusType, VoteThreshold } from 'src/types';
import GovSidebarCard from 'src/ui-components/GovSidebarCard';
import HelperTooltip from 'src/ui-components/HelperTooltip';
import Loader from 'src/ui-components/Loader';
import PassingInfoTag from 'src/ui-components/PassingInfoTag';
import VoteProgress from 'src/ui-components/VoteProgress';
import formatBnBalance from 'src/util/formatBnBalance';
import getNetwork from 'src/util/getNetwork';

interface Props {
	className?: string
	referendumId: number
	threshold?: VoteThreshold
}

const ZERO = new BN(0);
const NETWORK = getNetwork();

const ReferendumVoteInfo = ({ className, referendumId }: Props) => {
	const [totalIssuance, setTotalIssuance] = useState(ZERO);
	const [loadingStatus, setLoadingStatus] = useState<LoadingStatusType>({ isLoading: true, message:'Loading votes' });
	const [voteInfo, setVoteInfo] = useState<any | null>(null);

	const { data: tokenData, error:tokenDataError } = useFetch<any>(
		`https://${NETWORK}.api.subscan.io/api/scan/token`,
		{
			headers: subscanApiHeaders,
			method: 'POST'
		}
	);

	const { data: voteInfoData, error:voteInfoError } = useFetch<any>(
		`https://${NETWORK}.api.subscan.io/api/scan/democracy/referendum`,
		{
			body: JSON.stringify({
				referendum_index: referendumId
			}),
			headers: subscanApiHeaders,
			method: 'POST'
		}
	);

	useEffect(() => {
		setLoadingStatus({
			isLoading: true,
			message: 'Loading Data'
		});

		if(!tokenDataError && tokenData && tokenData.data) {
			setTotalIssuance(tokenData.data.detail[chainProperties[NETWORK].tokenSymbol].total_issuance);
		}

		setLoadingStatus({
			isLoading: false,
			message: 'Loading Data'
		});
	}, [tokenData, tokenDataError]);

	useEffect(() => {
		setLoadingStatus({
			isLoading: true,
			message: 'Loading Data'
		});

		if(!voteInfoError && voteInfoData && voteInfoData.data && voteInfoData.data.info) {
			const info = voteInfoData.data.info;
			if (info.status === 'notPassed'){
				info.isPassing = false;
			} else {
				info.isPassing = true;
			}
			info.aye_amount = new BN(info.aye_amount);
			info.aye_without_conviction = new BN(info.aye_without_conviction);
			info.nay_amount = new BN(info.nay_amount);
			info.nay_without_conviction = new BN(info.nay_without_conviction);
			info.turnout = new BN(info.turnout);
			setVoteInfo(info);
		}

		setLoadingStatus({
			isLoading: false,
			message: 'Loading Data'
		});
	}, [voteInfoData, voteInfoError]);

	const turnoutPercentage = useMemo( () => {
		if (totalIssuance.isZero()) {
			return 0;
		}
		// BN doens't handle floats. If we devide a number by a bigger number (12/100 --> 0.12), the result will be 0
		// therefore, we first multiply by 10 000, which gives (120 000/100 = 1200) go to Number which supports floats
		// and devide by 100 to have percentage --> 12.00%
		return voteInfo?.turnout.muln(10000).div(totalIssuance).toNumber()/100;
	} , [voteInfo?.turnout, totalIssuance]);

	return (
		<>
			{!voteInfo ?
				<GovSidebarCard className='flex items-center justify-center min-h-[100px]'>
					<Loader />
				</GovSidebarCard>
				:
				<GovSidebarCard className={className}>
					<Spin spinning={loadingStatus.isLoading} indicator={<LoadingOutlined />}>
						<div className="flex justify-between mb-7">
							<h6 className='dashboard-heading'>Voting Status</h6>
							<PassingInfoTag isPassing={voteInfo?.isPassing}/>
						</div>

						<div className="flex justify-between">
							<VoteProgress
								ayeVotes={voteInfo?.aye_amount}
								className='vote-progress'
								nayVotes={voteInfo?.nay_amount}
							/>

							<div className='flex-1 flex flex-col justify-center pl-2'>
								<div className='mb-3 flex items-center'>
									<div className='mr-auto text-sidebarBlue font-medium'>Turnout {turnoutPercentage > 0 && <span className='turnoutPercentage'>({turnoutPercentage}%)</span>}</div>
									<div className='text-navBlue'>{formatBnBalance(voteInfo?.turnout, { numberAfterComma: 2, withUnit: true })}</div>
								</div>

								<div className='mb-3 flex items-center'>
									<div className='mr-auto text-sidebarBlue font-medium flex items-center'>Aye <HelperTooltip className='ml-2' text='Aye votes without taking conviction into account'/></div>
									<div className='text-navBlue'>{formatBnBalance(voteInfo?.aye_without_conviction, { numberAfterComma: 2, withUnit: true })}</div>
								</div>

								<div className='flex items-center'>
									<div className='mr-auto text-sidebarBlue font-medium flex items-center'>Nay <HelperTooltip className='ml-2' text='Nay votes without taking conviction into account'/></div>
									<div className='text-navBlue'>{formatBnBalance(voteInfo?.nay_without_conviction, { numberAfterComma: 2, withUnit: true })}</div>
								</div>
							</div>
						</div>
					</Spin>
				</GovSidebarCard>}
		</>
	);
};

export default memo(ReferendumVoteInfo);
