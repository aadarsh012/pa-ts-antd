// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueryLazyOptions } from '@apollo/client';
import styled from '@xstyled/styled-components';
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Exact, ReplyFieldsFragment } from 'src/generated/graphql';
import CreationLabel from 'src/ui-components/CreationLabel';
import UpdateLabel from 'src/ui-components/UpdateLabel';
import UserAvatar from 'src/ui-components/UserAvatar';
import getDefaultAddressField from 'src/util/getDefaultAddressField';

import EditableReplyContent from './EditableReplyContent';

interface Props{
	className?: string,
	reply: ReplyFieldsFragment,
	refetch: ((options?: QueryLazyOptions<Exact<{
		id: number;
	}>> | undefined) => void) | ((options?: QueryLazyOptions<Exact<{
		hash: string;
	}>> | undefined) => void)
}

export const Reply = ({ className, reply, refetch } : Props) => {
	const { author, content, comment_id, created_at, id, updated_at } = reply;
	const { hash } = useLocation();
	const replyRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (hash === `#${id}`) {
			window.scrollTo(0, replyRef.current?.offsetTop || 0);
		}
	}, [hash, id]);

	if (!author || !author.id || !author.username || !content) return <div>Reply not available</div>;

	const defaultAddressField = getDefaultAddressField();
	const defaultAddress = author[defaultAddressField];

	return (
		<div id={id} ref={replyRef} className={`${className} flex gap-x-4 mb-9`}>
			<UserAvatar
				className='mt-1 hidden md:inline-block'
				username={author.username}
				size='large'
				id={id}
			/>
			<div>
				<CreationLabel
					className='creation-label py-2 px-4 bg-comment_bg rounded-t-md'
					created_at={created_at}
					defaultAddress={defaultAddress}
					text={'replied'}
					username={author.username}
					hideCreatedAt={true}
				>
					<UpdateLabel
						created_at={created_at}
						updated_at={updated_at}
					/>
				</CreationLabel>
				<EditableReplyContent
					authorId={author.id}
					className='comment-content'
					commentId={comment_id}
					reply={reply}
					replyId={id}
					content={content}
					refetch={refetch}
				/>
			</div>
		</div>
	);
};

export default styled(Reply)`
	.comment-content {
		padding: 0.8rem 2rem;
		width: 100%;
	}
`;
