import * as React from 'react';
export declare namespace IconItem {
    interface IProps {
        source: string;
    }
}
export declare const IconItem: (props: IconItem.IProps & React.HTMLAttributes<HTMLDivElement> & {
    offset: {
        x: number;
        y: number;
    };
}) => React.ReactElement<IconItem.IProps>;
