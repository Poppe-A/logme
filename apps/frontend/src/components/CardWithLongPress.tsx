import React, { useRef, useState, type PropsWithChildren } from 'react';
import { ButtonBase, Card, styled, type CardProps } from '@mui/material';

interface IButtonWithLongPress extends Omit<CardProps, 'onClick'> {
  onClick: () => void;
  onLongPress?: () => void;
  longPressDelay?: number;
  children: React.ReactNode;
}

export const StyledCard = styled(Card)`
  width: 100%;
  align-items: center;
  vertical-align: middle;
`;

export const CardWithLongPress: React.FC<
  PropsWithChildren<IButtonWithLongPress>
> = ({
  onClick,
  onLongPress,
  longPressDelay = 500,
  children,
  ...cardProps
}) => {
  const [isLongPress, setIsLongPress] = useState(false);
  const timeout = useRef<number | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(false);
  const MOVE_THRESHOLD = 5; // px

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsLongPress(false);
    moved.current = false;

    if ('touches' in e && e.touches.length > 0) {
      startPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if ('clientX' in e) {
      startPos.current = { x: e.clientX, y: e.clientY };
    }

    timeout.current = window.setTimeout(() => {
      setIsLongPress(true);
      if (onLongPress) {
        onLongPress();
      }
    }, longPressDelay);
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!startPos.current) return;

    let currentPos;
    if ('touches' in e && e.touches.length > 0) {
      currentPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if ('clientX' in e) {
      currentPos = { x: e.clientX, y: e.clientY };
    }

    if (
      currentPos &&
      (Math.abs(currentPos.x - startPos.current.x) > MOVE_THRESHOLD ||
        Math.abs(currentPos.y - startPos.current.y) > MOVE_THRESHOLD)
    ) {
      moved.current = true;
      if (timeout.current !== null) {
        window.clearTimeout(timeout.current);
        timeout.current = null;
      }
    }
  };

  const handleEnd = (e?: React.TouchEvent | React.MouseEvent) => {
    e?.preventDefault?.();

    if (timeout.current !== null) {
      window.clearTimeout(timeout.current);
      timeout.current = null;
    }

    if (!isLongPress && !moved.current) {
      onClick();
    }
    setIsLongPress(false);
    startPos.current = null;
    moved.current = false;
  };

  const handleCancel = () => {
    if (timeout.current !== null) {
      window.clearTimeout(timeout.current);
      timeout.current = null;
    }
    setIsLongPress(false);
    startPos.current = null;
    moved.current = false;
  };

  return (
    <ButtonBase>
      <StyledCard
        {...cardProps}
        onTouchStart={handleStart}
        onTouchEnd={e => handleEnd(e)}
        onTouchCancel={handleCancel}
        onTouchMove={handleMove}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleCancel}
        sx={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          ...cardProps.sx,
        }}
        elevation={0}
      >
        {children}
      </StyledCard>
    </ButtonBase>
  );
};
