import { useEffect, useRef } from "react";

const ITEM_DISTANCE = 420;
const ITEM_ANGLE = 0;
const VIEW_ANGLE = 50;

const PhotoRow = (props:{imageData:string[]}) => {
  
  const el = useRef<HTMLDivElement>(null);
  const animId = useRef<number>(0);
  const angleId = useRef<number>(0);
  let currentDistance:number, nextDistance:number, currentAngle:number, nextAngle:number, currentIndex:number;

  useEffect(() => {

    // Setup item positions and angels
    const items = el.current!.children;
    const originX = -items.length * ITEM_DISTANCE * 0.5;

    for (let i = 0; i < items.length; i++) {

      const item = items[i] as HTMLDivElement;
      item.style.transform = `rotateX(${ITEM_ANGLE}deg) translateX(${i * ITEM_DISTANCE + originX}px)`;
    }

    // Reset transition parameters
    currentDistance = nextDistance = 0;
    currentAngle = nextAngle = 0;
    currentIndex = Math.floor(items.length * 0.5)

    cancelAnimationFrame(animId.current);
    const gallery = el.current!;

    const updateFrame = () => {
      
      currentDistance += (nextDistance - currentDistance) * 0.025;
      currentAngle += (nextAngle - currentAngle) * 0.035;
      gallery.style.transform = `rotateY(${currentAngle}deg) translateX(${currentDistance}px) translateZ(-320px) `;
      animId.current = requestAnimationFrame(updateFrame);
    }
    updateFrame();

    // Enable scrolling via mousewheel
    el.current!.parentElement!.onwheel = (e:WheelEvent) => {

      const deltaY = Math.abs(e.deltaY) > 100 ? e.deltaY * 0.01 : e.deltaY * 0.2;
      const delta = Math.floor(deltaY);
      let nextIndex = currentIndex + delta;
      if (nextIndex < 0) nextIndex = 0;
      if (nextIndex >= el.current!.children.length) nextIndex = el.current!.children.length - 1;
      target(nextIndex);
    }

  }, [props.imageData]);

  // Target an item, bring it to center
  function target(index:number) {

    const originX = el.current!.children.length * ITEM_DISTANCE * 0.5;
    const distance = -index * ITEM_DISTANCE + originX;
    clearTimeout(angleId.current);
    if (index < currentIndex || index == 0) 
      nextAngle = -VIEW_ANGLE;
    else
      nextAngle = VIEW_ANGLE;
    angleId.current = setTimeout(() => {
      nextAngle = 0;
    }, 800);
    nextDistance = distance;
    currentIndex = index;
  }

  
  return (
    <div className="container my-4">
      <div className="photo-row" ref={el}>
        {props.imageData.map((it, index) => 
          <div 
              onClick={() => target(index)}
              key={index} 
              style={{backgroundImage:`url(${it})`}}
              className='photo-row-item'>
          </div>)
        }
      </div>
    </div>
  )
}

export default PhotoRow;
