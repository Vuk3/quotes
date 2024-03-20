import React from 'react';

export interface Props {
  id: number;
  value: string;
}

const Tag: React.FC<Props> = ({ id, value }) => {
  return (
    <div id={`tag-${id}`}>
      {value}
    </div>
  );
};

export default Tag;
