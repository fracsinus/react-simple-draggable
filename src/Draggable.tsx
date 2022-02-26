import { render } from '@testing-library/react';
import { createCipheriv } from 'crypto';
import React, { useCallback, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import internal from 'stream';
import { isConstructorDeclaration, TypeOfTag } from 'typescript';

type Props = {
  children: React.ReactElement;
  boundary?: Boundary;
  nodeRef?: React.RefObject<any>;
}

type MouseTouchEvent<T> = React.MouseEvent<T> & React.TouchEvent<T>;
type EventHandler<T> = (e:T) => void | false;
type T = HTMLElement | null;
type Boundary = {top: number; left: number; right: number; bottom: number} | string

export default function DragTest({children, boundary='body', nodeRef}: Props) {
  const position = useRef({
    x: 0,
    y: 0.
  })
  const control = useRef({
    x: NaN,
    y: NaN,
  })
  const deviation = useRef({
    x: 0,
    y: 0,
  })
  const threshold = useRef({
    left: NaN,
    top: NaN,
    right: NaN,
    bottom: NaN,
  })

  let thisRef = useRef<HTMLElement>(null);
  thisRef = nodeRef ?? thisRef;

  function handleDragStart(e: React.MouseEvent<HTMLElement>) {
    if (e.button !== 0) { return; }
    if (!thisRef.current) { return; }
    if (boundary && isNaN(threshold.current.left)) {
      let boundaryRect: Boundary;
      const border = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      }
      if (typeof(boundary) === 'string') {
        const boundNode = document.querySelector(boundary);
        if (!boundNode) { throw `boundary element '${threshold}' not found`; }
        boundaryRect = boundNode.getBoundingClientRect() as DOMRect;
        const boundaryStyle = window.getComputedStyle(boundNode);
        border.left += parseInt(boundaryStyle.borderLeftWidth);
        border.top += parseInt(boundaryStyle.borderTopWidth);
        border.right += parseInt(boundaryStyle.borderRightWidth);
        border.bottom += parseInt(boundaryStyle.borderBottomWidth);
      } else {
        boundaryRect = boundary;
      }
      const nodeRect = thisRef.current.getBoundingClientRect();
      threshold.current = {
        left: boundaryRect.left - nodeRect.left + border.left,
        top: boundaryRect.top - nodeRect.top + border.top,
        right: boundaryRect.right - nodeRect.left - nodeRect.width - border.top,
        bottom: boundaryRect.bottom - nodeRect.top - nodeRect.height - border.top,
      };
    }

    thisRef.current.style.userSelect = "none"
    const {clientX: x, clientY: y} = e;
    control.current = {
      x, y
    }
    thisRef.current.ownerDocument.addEventListener('mousemove', handleDrag, {capture: true})
    thisRef.current.ownerDocument.addEventListener('mouseup', handleDragStop, {capture: true})
  }

  const handleDrag = useCallback((e: MouseEvent) => {
    if (!thisRef.current) { return; }
    const node = thisRef.current;
    const {clientX, clientY} = e;
    const {x, y} = control.current;
    const deltaX = clientX - x;
    const deltaY = clientY - y;

    const newPosition = {
      x: position.current.x + deltaX,
      y: position.current.y + deltaY,
    }

    if (boundary) {
      const copied = {...newPosition};
      newPosition.x += deviation.current.x;
      newPosition.y += deviation.current.y;
      newPosition.x = Math.max(threshold.current.left, newPosition.x)
      newPosition.y = Math.max(threshold.current.top, newPosition.y)

      newPosition.x = Math.min(threshold.current.right, newPosition.x)
      newPosition.y = Math.min(threshold.current.bottom, newPosition.y)

      deviation.current.x += copied.x - newPosition.x;
      deviation.current.y += copied.y - newPosition.y;
    }

    position.current = {...newPosition}
    control.current = {
      x: clientX,
      y: clientY,
    }
    thisRef.current.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`
  }, [])

  function handleDragStop(e: MouseEvent) {
    if (!thisRef.current) { return; }
    deviation.current = {x: 0, y: 0};
    thisRef.current.style.userSelect = "auto"

    thisRef.current.ownerDocument.removeEventListener('mousemove', handleDrag, {capture: true})
    thisRef.current.ownerDocument.removeEventListener('mouseup', handleDragStop, {capture: true})
  }

  return React.cloneElement(React.Children.only(children), {onMouseDown: handleDragStart, ref: thisRef})
}