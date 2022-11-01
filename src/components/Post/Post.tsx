// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//TODO: REMOVE
/* eslint-disable sort-keys */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tabs } from 'antd';
import { ApolloQueryResult } from 'apollo-client';
import React, { useContext, useEffect, useState } from 'react';
import { MetaContext } from 'src/context/MetaContext';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { BountyPostAndCommentsQuery, BountyPostAndCommentsQueryHookResult, BountyPostFragment, ChildBountyPostAndCommentsQuery, ChildBountyPostAndCommentsQueryHookResult, ChildBountyPostFragment, DiscussionPostAndCommentsQuery, DiscussionPostAndCommentsQueryHookResult, DiscussionPostFragment, MotionPostAndCommentsQuery, MotionPostAndCommentsQueryHookResult, MotionPostFragment, OnchainLinkBountyFragment, OnchainLinkChildBountyFragment, OnchainLinkMotionFragment, OnchainLinkProposalFragment, OnchainLinkReferendumFragment, OnchainLinkTechCommitteeProposalFragment, OnchainLinkTipFragment, OnchainLinkTreasuryProposalFragment, ProposalPostAndCommentsQuery, ProposalPostAndCommentsQueryHookResult, ProposalPostFragment, ReferendumPostAndCommentsQuery, ReferendumPostAndCommentsQueryHookResult, ReferendumPostFragment, TechCommitteeProposalPostAndCommentsQuery, TechCommitteeProposalPostAndCommentsQueryHookResult, TechCommitteeProposalPostFragment, TipPostAndCommentsQuery, TipPostAndCommentsQueryHookResult, TipPostFragment, TreasuryProposalPostAndCommentsQuery, TreasuryProposalPostAndCommentsQueryHookResult, TreasuryProposalPostFragment } from 'src/generated/graphql';
import { PostCategory } from 'src/global/post_categories';
import { PostEmptyState } from 'src/ui-components/UIStates';

import OptionPoll from './ActionsBar/OptionPoll';
import TrackerButton from './ActionsBar/TrackerButton';
import EditablePostContent from './EditablePostContent';
import Poll from './Poll';
import PostHeading from './PostHeading';
import PostDescription from './Tabs/PostDescription';
import PostOnChainInfo from './Tabs/PostOnChainInfo';
import PostTimeline from './Tabs/PostTimeline';

interface Props {
	className?: string
	data: (
		DiscussionPostAndCommentsQueryHookResult['data'] |
		ProposalPostAndCommentsQueryHookResult['data'] |
		ReferendumPostAndCommentsQueryHookResult['data'] |
		MotionPostAndCommentsQueryHookResult['data'] |
		TreasuryProposalPostAndCommentsQueryHookResult['data'] |
		TipPostAndCommentsQueryHookResult['data'] |
		BountyPostAndCommentsQueryHookResult['data'] |
		TechCommitteeProposalPostAndCommentsQueryHookResult['data'] |
		ChildBountyPostAndCommentsQueryHookResult['data']
	)
	isBounty?: boolean
	isMotion?: boolean
	isProposal?: boolean
	isReferendum?: boolean
	isTreasuryProposal?: boolean
	isTechCommitteeProposal?: boolean
	isTipProposal?: boolean
	isChildBounty?: boolean
	refetch: (variables?:any) =>
		Promise<ApolloQueryResult<ReferendumPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<ProposalPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<MotionPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<TreasuryProposalPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<TipPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<BountyPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<DiscussionPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<TechCommitteeProposalPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<ChildBountyPostAndCommentsQuery>>
}

interface Redirection {
	link?: string;
	text?: string;
}

const Post = ( { className, data, isBounty = false, isChildBounty = false, isMotion = false, isProposal = false, isReferendum = false, isTipProposal = false, isTreasuryProposal = false, isTechCommitteeProposal = false, refetch }: Props ) => {
	const post = data && data.posts && data.posts[0];
	const { id, addresses } = useContext(UserDetailsContext);
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = () => setIsEditing(!isEditing);
	const { setMetaContextState } = useContext(MetaContext);

	useEffect(() => {
		const users: string[] = [];

		if (post?.author?.username) {
			users.push(post?.author?.username);
		}

		post?.comments.forEach(c => {
			if (c.author?.username && !users.includes(c.author?.username)) {
				users.push(c.author?.username);
			}
		});
		global.window.localStorage.setItem('users', users.join(','));
	}, [post]);

	useEffect(() => {
		setMetaContextState((prevState) => {
			return {
				...prevState,
				description: post?.content || prevState.description,
				title: `${post?.title || 'Polkassembly' }`
			};
		});
	}, [post, setMetaContextState]);

	const isOnchainPost = isMotion || isProposal || isReferendum || isTreasuryProposal || isBounty || isTechCommitteeProposal || isTipProposal;

	let onchainId: string | number | null | undefined;
	let referendumPost: ReferendumPostFragment | undefined;
	let proposalPost: ProposalPostFragment | undefined;
	let motionPost: MotionPostFragment | undefined;
	let treasuryPost: TreasuryProposalPostFragment | undefined;
	let tipPost: TipPostFragment | undefined;
	let bountyPost: BountyPostFragment | undefined;
	let childBountyPost: ChildBountyPostFragment | undefined;
	let techCommitteeProposalPost: TechCommitteeProposalPostFragment | undefined;
	let definedOnchainLink: OnchainLinkTechCommitteeProposalFragment | OnchainLinkBountyFragment | OnchainLinkChildBountyFragment | OnchainLinkMotionFragment | OnchainLinkReferendumFragment | OnchainLinkProposalFragment | OnchainLinkTipFragment | OnchainLinkTreasuryProposalFragment | undefined;
	let postStatus: string | undefined;
	let redirection: Redirection = {};

	if (post && isTechCommitteeProposal) {
		techCommitteeProposalPost = post as TechCommitteeProposalPostFragment;
		definedOnchainLink = techCommitteeProposalPost.onchain_link as OnchainLinkTechCommitteeProposalFragment;
		onchainId = definedOnchainLink.onchain_tech_committee_proposal_id;
		postStatus = techCommitteeProposalPost?.onchain_link?.onchain_tech_committee_proposal?.[0]?.status?.[0].status;
	}

	if (post && isBounty) {
		bountyPost = post as BountyPostFragment;
		definedOnchainLink = bountyPost.onchain_link as OnchainLinkBountyFragment;
		onchainId = definedOnchainLink.onchain_bounty_id;
		postStatus = bountyPost?.onchain_link?.onchain_bounty?.[0]?.bountyStatus?.[0].status;
	}

	if (post && isChildBounty) {
		childBountyPost = post as ChildBountyPostFragment;
		definedOnchainLink = childBountyPost.onchain_link as OnchainLinkChildBountyFragment;
		onchainId = definedOnchainLink.onchain_child_bounty_id;
		postStatus = childBountyPost?.onchain_link?.onchain_child_bounty?.[0]?.childBountyStatus?.[0].status;
	}

	if (post && isReferendum) {
		referendumPost = post as ReferendumPostFragment;
		definedOnchainLink = referendumPost.onchain_link as OnchainLinkReferendumFragment;
		onchainId = definedOnchainLink.onchain_referendum_id;
		postStatus = referendumPost?.onchain_link?.onchain_referendum?.[0]?.referendumStatus?.[0].status;
	}

	if (post && isProposal) {
		proposalPost = post as ProposalPostFragment;
		definedOnchainLink = proposalPost.onchain_link as OnchainLinkProposalFragment;
		onchainId = definedOnchainLink.onchain_proposal_id;
		postStatus = proposalPost?.onchain_link?.onchain_proposal?.[0]?.proposalStatus?.[0].status;
		if (definedOnchainLink.onchain_referendum_id || definedOnchainLink.onchain_referendum_id === 0){
			redirection = {
				link: `/referendum/${definedOnchainLink.onchain_referendum_id}`,
				text: `Referendum #${definedOnchainLink.onchain_referendum_id}`
			};
		}
	}

	if (post && isMotion) {
		motionPost = post as MotionPostFragment;
		definedOnchainLink = motionPost.onchain_link as OnchainLinkMotionFragment;
		onchainId = definedOnchainLink.onchain_motion_id;
		postStatus = motionPost?.onchain_link?.onchain_motion?.[0]?.motionStatus?.[0].status;
		if (definedOnchainLink.onchain_referendum_id || definedOnchainLink.onchain_referendum_id === 0){
			redirection = {
				link: `/referendum/${definedOnchainLink.onchain_referendum_id}`,
				text: `Referendum #${definedOnchainLink.onchain_referendum_id}`
			};
		}
	}

	if (post && isTreasuryProposal) {
		treasuryPost = post as TreasuryProposalPostFragment;
		definedOnchainLink = treasuryPost.onchain_link as OnchainLinkTreasuryProposalFragment;
		onchainId = definedOnchainLink.onchain_treasury_proposal_id;
		postStatus = treasuryPost?.onchain_link?.onchain_treasury_spend_proposal?.[0]?.treasuryStatus?.[0].status;
		if (definedOnchainLink.onchain_motion_id || definedOnchainLink.onchain_motion_id === 0){
			redirection = {
				link: `/motion/${definedOnchainLink.onchain_motion_id}`,
				text: `Motion #${definedOnchainLink.onchain_motion_id}`
			};
		}
	}

	if (post && isTipProposal) {
		tipPost = post as TipPostFragment;
		definedOnchainLink = tipPost.onchain_link as OnchainLinkTipFragment;
		onchainId = definedOnchainLink.onchain_tip_id;
		postStatus = tipPost?.onchain_link?.onchain_tip?.[0]?.tipStatus?.[0].status;
	}

	const isDiscussion = (post: TechCommitteeProposalPostFragment | BountyPostFragment | ChildBountyPostFragment | TipPostFragment | TreasuryProposalPostFragment | MotionPostFragment | ProposalPostFragment | DiscussionPostFragment | ReferendumPostFragment): post is DiscussionPostFragment => {
		if (!isTechCommitteeProposal && !isReferendum && !isProposal && !isMotion && !isTreasuryProposal && !isTipProposal && !isBounty && !isChildBounty) {
			return (post as DiscussionPostFragment) !== undefined;
		}

		return false;
	};

	if (!post) {
		const postCategory: PostCategory = isMotion ? PostCategory.MOTION : isProposal ? PostCategory.PROPOSAL : isReferendum ? PostCategory.REFERENDA : isTreasuryProposal ? PostCategory.TREASURY_PROPOSAL : isTipProposal ? PostCategory.TIP : isBounty ? PostCategory.TIP : isTechCommitteeProposal ? PostCategory.TECH_COMMITTEE_PROPOSAL : isChildBounty ? PostCategory.CHILD_BOUNTY : PostCategory.DISCUSSION;
		return <div className='mt-16'><PostEmptyState postCategory={postCategory} /></div>;
	}

	const isBountyProposer = isBounty && bountyPost?.onchain_link?.proposer_address && addresses?.includes(bountyPost.onchain_link.proposer_address);
	const isChildBountyProposer = isChildBounty && childBountyPost?.onchain_link?.proposer_address && addresses?.includes(childBountyPost.onchain_link.proposer_address);
	const isProposalProposer = isProposal && proposalPost?.onchain_link?.proposer_address && addresses?.includes(proposalPost.onchain_link.proposer_address);
	const isReferendumProposer = isReferendum && referendumPost?.onchain_link?.proposer_address && addresses?.includes(referendumPost.onchain_link.proposer_address);
	const isMotionProposer = isMotion && motionPost?.onchain_link?.proposer_address && addresses?.includes(motionPost.onchain_link.proposer_address);
	const isTreasuryProposer = isTreasuryProposal && treasuryPost?.onchain_link?.proposer_address && addresses?.includes(treasuryPost.onchain_link.proposer_address);
	const isTipProposer = isTipProposal && tipPost?.onchain_link?.proposer_address && addresses?.includes(tipPost.onchain_link.proposer_address);
	const isTechCommitteeProposalProposer = isTechCommitteeProposal && techCommitteeProposalPost?.onchain_link?.proposer_address && addresses?.includes(techCommitteeProposalPost.onchain_link.proposer_address);
	const canEdit = !isEditing && (
		post.author?.id === id ||
		isProposalProposer ||
		isReferendumProposer ||
		isMotionProposer ||
		isTreasuryProposer ||
		isTipProposer ||
		isBountyProposer ||
		isTechCommitteeProposalProposer ||
		isChildBountyProposer
	);

	const Sidebar = ({ className } : {className?:string}) => {
		return (
			<div className={`${className} flex flex-col w-full lg:w-4/12 mx-auto`}>
				{isDiscussion(post) && <Poll postId={post.id} canEdit={post.author?.id === id} />}
				<OptionPoll postId={post.id} canEdit={post.author?.id === id} />
			</div>
		);
	};

	const TrackerButtonComp = <>
		{id && onchainId && isOnchainPost && !isEditing && (
			<TrackerButton
				onchainId={onchainId}
				isBounty={isBounty}
				isMotion={isMotion}
				isProposal={isProposal}
				isReferendum={isReferendum}
				isTipProposal={isTipProposal}
				isTreasuryProposal={isTreasuryProposal}
				isTechCommitteeProposal={isTechCommitteeProposal}
			/>)
		}
	</>;

	const getOnChainTabs = () => {
		if (isDiscussion(post)) return [];

		const onChainTabs = [
			{ label: 'Timeline',
				key: 'timeline',
				children: <PostTimeline
					isBounty={isBounty}
					isMotion={isMotion}
					isProposal={isProposal}
					isReferendum={isReferendum}
					isTipProposal={isTipProposal}
					isTreasuryProposal={isTreasuryProposal}
					isTechCommitteeProposal={isTechCommitteeProposal}
					isChildBounty={isChildBounty}
					referendumPost={referendumPost}
					proposalPost={proposalPost}
					motionPost={motionPost}
					treasuryPost={treasuryPost}
					tipPost={tipPost}
					bountyPost={bountyPost}
					childBountyPost={childBountyPost}
					techCommitteeProposalPost={techCommitteeProposalPost}
				/>
			},
			{ label: 'On Chain Info',
				key: 'onChainInfo',
				children: <PostOnChainInfo
					isBounty={isBounty}
					isMotion={isMotion}
					isProposal={isProposal}
					isReferendum={isReferendum}
					isTipProposal={isTipProposal}
					isTreasuryProposal={isTreasuryProposal}
					isTechCommitteeProposal={isTechCommitteeProposal}
					isChildBounty={isChildBounty}
					definedOnchainLink={definedOnchainLink}
				/>
			}
		];

		return onChainTabs;
	};

	const tabItems: any[] = [
		{ label: 'Description',
			key: 'description',
			children: <PostDescription
				id={id}
				post={post}
				isEditing={isEditing}
				canEdit={canEdit}
				toggleEdit={toggleEdit}
				isOnchainPost={isOnchainPost}
				TrackerButtonComp={TrackerButtonComp}
				Sidebar={Sidebar}
				refetch={refetch}
			/>
		},
		...getOnChainTabs()
	];

	return (
		<>
			<div className={`${className} flex flex-col lg:flex-row`}>
				{/* Post Content */}
				<div className='bg-white drop-shadow-md p-3 md:p-6 rounded-md w-full flex-1 lg:w-8/12 mx-auto lg:mr-9 mb-6 lg:mb-0'>
					{isEditing && <EditablePostContent
						post={post}
						refetch={refetch}
						toggleEdit={toggleEdit}
					/>}

					<PostHeading className='mb-8' isTipProposal={isTipProposal} onchainId={onchainId} post={post} postStatus={postStatus} />

					<Tabs
						type="card"
						items={tabItems}
					/>
				</div>

				{!isEditing && <Sidebar className='hidden lg:block' />}

			</div>
		</>
	);
};

export default Post;