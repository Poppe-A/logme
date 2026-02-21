import { Switch } from '@mui/material';
import { StyledFormControlLabel } from '../../components/form/FormSwitch';

interface SettingSwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  disabled?: boolean;
}

export const SettingSwitch: React.FC<SettingSwitchProps> = ({
  checked,
  onChange,
  label,
  disabled,
}) => (
  <StyledFormControlLabel
    labelPlacement="start"
    disabled={disabled}
    control={
      <Switch
        checked={checked}
        onChange={ev => onChange(ev.target.checked)}
      />
    }
    label={label}
  />
);
