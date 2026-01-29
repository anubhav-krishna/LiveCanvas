export function setupCanvas(canvas) {
  const ctx = canvas.getContext("2d");

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.scale(dpr, dpr);

  return ctx;
}

let isDrawing = false;
let activeStroke = null;

export function startStroke(x,y){
    isDrawing= true;

    activeStroke= {
        color : "white",
        width: 2,
        points: [{x,y}]
    };
}

export function addPoint(x,y,ctx){
    if(!isDrawing || !activeStroke)return;

    const points= activeStroke.points;
    const prevPoint= points[points.length -1];

    ctx.strokeStyle= activeStroke.color;
    ctx.lineWidth= activeStroke.width;
    ctx.lineCap= "round";
    
    ctx.beginPath();
    ctx.moveTo(prevPoint.x,prevPoint.y);
    ctx.lineTo(x,y);
    ctx.stroke();

    points.push({x,y});
}

export function endStroke(){
    isDrawing= false;
    activeStroke=null;
}