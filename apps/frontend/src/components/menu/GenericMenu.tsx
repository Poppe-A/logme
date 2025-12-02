import { Menu, MenuItem } from '@mui/material';

export interface MenuItem {
  label: string;
  action: () => void;
}

interface IGenericMenu {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menuItems: MenuItem[];
  id: string;
  anchor: HTMLElement | null;
  handleClose: () => void;
}
export const GenericMenu: React.FC<IGenericMenu> = ({
  menuItems,
  id,
  anchor,
  handleClose,
}) => {
  const onClick = (action: () => void) => {
    handleClose();
    action();
  };
  return (
    <Menu
      id={id}
      anchorEl={anchor}
      open={Boolean(anchor)}
      onClose={handleClose}
      slotProps={{
        list: {
          'aria-labelledby': 'basic-button',
        },
      }}
    >
      {menuItems.map(item => (
        <MenuItem key={item.label} onClick={() => onClick(item.action)}>
          {item.label}
        </MenuItem>
      ))}
    </Menu>
  );
};
