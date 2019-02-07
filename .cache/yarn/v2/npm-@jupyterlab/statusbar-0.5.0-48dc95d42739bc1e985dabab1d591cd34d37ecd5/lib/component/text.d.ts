import * as React from 'react';
export declare namespace TextItem {
    interface IProps {
        source: any;
        title?: string;
    }
}
export declare const TextItem: (props: TextItem.IProps & React.HTMLAttributes<HTMLSpanElement>) => React.ReactElement<TextItem.IProps>;
