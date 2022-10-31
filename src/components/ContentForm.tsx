// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Form } from 'antd';
import React, { useState } from 'react';

import MarkdownEditor from '../ui-components/MarkdownEditor';
import messages from '../util/messages';

interface Props {
	className?: string
	errorContent?: any
	height?: number
	onChange?: any
	value?: string
}

type ValidationStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

type ValidationResult = {
	errorMsg: string | null;
	validateStatus: ValidationStatus;
}

const validateContent = (
	content: string
): ValidationResult => {
	if(content) {
		return {
			errorMsg: null,
			validateStatus: 'success'
		};
	}
	return {
		errorMsg: 'Please add the content.',
		validateStatus: 'error'
	};
};

const ContentForm = ({ className, errorContent, height, onChange, value }: Props): JSX.Element => {

	const [validationStatus, setValidation] = useState<ValidationResult>({
		errorMsg: null,
		validateStatus: 'success'
	});

	const onChangeWrapper = (content:string) => {
		const validationStatus = validateContent(content);
		setValidation(validationStatus);
		if(onchange){
			onChange!(content);
		}

		return content;
	};

	return (
		<div className={className}>
			<Form.Item valuePropName='value' getValueFromEvent={onChangeWrapper} name='content' validateStatus={validationStatus.validateStatus} help={validationStatus.errorMsg}>
				<MarkdownEditor
					className={ errorContent? 'error': ''}
					height={height}
					name='content'
					onChange={onChangeWrapper}
					value={value || ''}
				/>
			</Form.Item>
			{errorContent && <div className={'errorText'}>{messages.VALIDATION_CONTENT_ERROR}</div>}
		</div>
	);
};

export default ContentForm;