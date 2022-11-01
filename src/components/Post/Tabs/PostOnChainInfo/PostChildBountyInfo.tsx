// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Col, Row } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { OnchainLinkChildBountyFragment } from 'src/generated/graphql';
import { chainProperties } from 'src/global/networkConstants';
import Address from 'src/ui-components/Address';
import getNetwork from 'src/util/getNetwork';

import OnchainInfoWrapper from './OnchainInfoWrapper';

interface Props {
	onchainLink: OnchainLinkChildBountyFragment
	setOtherProposalsSidebarAddr: (address: string) => void
}

const currentNetwork = getNetwork();

const PostChildBountyInfo = ({ onchainLink, setOtherProposalsSidebarAddr }: Props) => {
	if (!onchainLink) return null;

	const {
		onchain_child_bounty: onchainChildBountyProposal,
		proposer_address: proposerAddress
	} = onchainLink;

	const {
		value,
		fee,
		curatorDeposit,
		curator,
		beneficiary,
		description,
		parentBountyId
	} = onchainChildBountyProposal?.[0] || { };

	return (
		<>
			<OnchainInfoWrapper>
				<Row gutter={40}>
					<Col xs={24} md={12}>
						<h6>Proposer
							<span className='text-pink_primary cursor-pointer ml-3' onClick={() => setOtherProposalsSidebarAddr(proposerAddress)}>
								View Other Proposals
							</span>
						</h6>
						<Address address={proposerAddress}/>
					</Col>
					{curator &&
					<Col xs={24} md={12}>
						<h6>Curator</h6>
						<Address address={curator}/>
					</Col>}
					{beneficiary &&
					<Col xs={24} md={12}>
						<h6>Beneficiary</h6>
						<Address address={beneficiary}/>
					</Col>}
					{value &&
					<Col xs={24} md={12}>
						<h6>Value</h6>
						{parseInt(value) / Math.pow(10, chainProperties[currentNetwork].tokenDecimals) + ' ' + chainProperties[currentNetwork].tokenSymbol}
					</Col>}
					{fee &&
					<Col xs={24} md={12}>
						<h6>Fee</h6>
						{parseInt(fee) / Math.pow(10, chainProperties[currentNetwork].tokenDecimals) + ' ' + chainProperties[currentNetwork].tokenSymbol}
					</Col>}
					{curatorDeposit &&
					<Col xs={24} md={12}>
						<h6>Curator Deposit</h6>
						{parseInt(curatorDeposit) / Math.pow(10, chainProperties[currentNetwork].tokenDecimals) + ' ' + chainProperties[currentNetwork].tokenSymbol}
					</Col>}
					{description &&
					<Col xs={24} md={12}>
						<h6>Description</h6>
						{description}
					</Col>}
					{parentBountyId &&
					<Col xs={24} md={12}>
						<h6>Parent Bounty</h6>
						<Link to={`/bounty/${parentBountyId}`}>#{parentBountyId}</Link>
					</Col>}
				</Row>
			</OnchainInfoWrapper>
		</>
	);
};

export default PostChildBountyInfo;
