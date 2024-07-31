import * as Icon from 'react-icons/fi';

interface Props {
  icon: keyof typeof Icon;
  size?: 4 | 8 | 12 | 14 | 16 | 20 | 24 | 32 | 48 | 64 | 96 | 128 | 192 | 256;
  strokeWidth?: 1 | 2 | 3 | 4;
}

export const MyIcon = ({ icon, size, strokeWidth = 2 }: Props) => {
  const MyIco = Icon[icon];
  return <MyIco size={size} strokeWidth={strokeWidth} />;
};

export type TypeFi = React.ComponentProps<typeof MyIcon>['icon'];
