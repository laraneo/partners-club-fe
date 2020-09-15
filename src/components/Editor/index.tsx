import React, {useState, useRef, FunctionComponent} from 'react';
import JoditEditor from "jodit-react";

type ComponentProps = {
	onChange: Function;
	content: string;
  };

const CustomEditor: FunctionComponent<ComponentProps> = ({ onChange, content }) => {
	const editor = useRef(null)

	const config = {
		readonly: false // all options from https://xdsoft.net/jodit/doc/
	}
	return (
            <JoditEditor
            	ref={editor}
                value={content}
                config={config}
		        onBlur={(newContent: any) => onChange(newContent)} // preferred to use only this option to update the content for performance reasons
            />
        );
}

export default CustomEditor;