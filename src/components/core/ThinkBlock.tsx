"use client";

import type { ClassAttributes, DetailsHTMLAttributes } from 'react';
import type { ExtraProps } from 'react-markdown';

import { ProgressBar } from '@fluentui/react-components';
import { cloneElement, isValidElement, useEffect, useRef, useState } from 'react';

import styles from './ThinkBlock.module.css';

interface IWithChildren {
  children?: React.ReactNode;
}

const hasEndThink = (children: React.ReactNode): boolean => {
  if (typeof children === 'string') {
    return children.includes('[ENDTHINKFLAG]');
  }

  if (Array.isArray(children)) {
    return children.some(child => hasEndThink(child as React.ReactNode));
  }

  if (isValidElement(children)) {
    const props = children.props as IWithChildren;
    if (props.children != null) {
      return hasEndThink(props.children);
    }
  }

  return false;
};

const removeEndThink = (children: React.ReactNode): React.ReactNode => {
  if (typeof children === 'string') {
    return children.replace('[ENDTHINKFLAG]', '');
  }

  if (Array.isArray(children)) {
    return children.map(child => removeEndThink(child as React.ReactNode));
  }

  if (isValidElement(children)) {
    const props = children.props as IWithChildren;
    if (props.children != null) {
      return cloneElement(children as React.ReactElement<IWithChildren>, {
        ...(children.props as object),
        children: removeEndThink(props.children),
      });
    }
  }

  return children;
};

const useThinkTimer = (children: React.ReactNode) => {
  const startTime = useRef(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | number | undefined>(undefined);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      if (!isComplete) {
        setElapsedTime(Math.floor((Date.now() - startTime.current) / 100) / 10);
      }
    }, 100);

    return () => {
      window.clearInterval(timerRef.current as NodeJS.Timeout);
    };
  }, [isComplete]);

  useEffect(() => {
    if (hasEndThink(children)) {
      setIsComplete(true);
      window.clearInterval(timerRef.current as NodeJS.Timeout);
    }
  }, [children]);

  return { elapsedTime, isComplete };
};

interface IThinkBlockProps extends DetailsHTMLAttributes<HTMLDetailsElement> {
  'data-think'?: boolean;
}

export function ThinkBlock({
  children,
  ...props
}: ClassAttributes<HTMLDetailsElement> &
  IThinkBlockProps &
  ExtraProps): React.ReactNode {
  const { elapsedTime, isComplete } = useThinkTimer(children);
  const displayContent = removeEndThink(children);

  if (!(props['data-think'] ?? false)) {
    return <details {...props}>{children}</details>;
  }

  return (
    <details {...(!isComplete && { open: true })} className={styles.thinkBlock}>
      <summary className={styles.thinkSummary}>
        <div className={styles.thinkHeader}>
          {!isComplete && <ProgressBar shape="rounded" thickness="medium" />}
          <span className={styles.thinkLabel}>
            {isComplete
              ? `thought (${elapsedTime.toFixed(1)}s)`
              : `thinking (${elapsedTime.toFixed(1)}s)`}
          </span>
        </div>
      </summary>
      <div className={styles.thinkContent}>{displayContent}</div>
    </details>
  );
}
