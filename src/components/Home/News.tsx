// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import { chainLinks } from 'src/global/networkConstants';
import getNetwork from 'src/util/getNetwork';

const network = getNetwork();

const News = () => {
	const profile = chainLinks[network].twitter.split('/')[3];
	return (
		<div className='bg-white drop-shadow-md p-2 lg:p-6 rounded-md h-full'>
			<h2 className='dashboard-heading mb-6'>News</h2>

			<div>
				<TwitterTimelineEmbed
					sourceType="profile"
					screenName={profile}
					options={ { height: 500 } }
					noHeader={true}
					noFooter={true}
				/>
			</div>
		</div>
	);
};

export default News;