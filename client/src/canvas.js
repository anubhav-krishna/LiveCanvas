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

const undoStack = [];
const redoStack = [];


export function startStroke(x,y,options){
    isDrawing= true;

    activeStroke= {
        color : options.color,
        width: options.width,
        tool: options.tool,
        points: [{x,y}]
    };
    undoStack.push(activeStroke);
    redoStack.length = 0;
}

export function addPoint(x,y,ctx){
    if(!isDrawing || !activeStroke)return;

    const points= activeStroke.points;
    const prevPoint= points[points.length -1];

   if (activeStroke.tool === "eraser") {
  ctx.globalCompositeOperation = "destination-out";
   } 
   else {
  ctx.globalCompositeOperation = "source-over";
  ctx.strokeStyle = activeStroke.color;
  }

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

export function redrawCanvas(ctx, canvas){
    console.log("Redrawing");
    ctx.clearRect(0,0,canvas.width,canvas.height);

    for(const stroke of undoStack){
        if(stroke.points.length==0)continue;

        ctx.beginPath();
        ctx.strokeStyle= stroke.color;
        ctx.lineWidth= stroke.width;
        ctx.lineCap= "round";

        const sPoints= stroke.points;
        ctx.moveTo(sPoints[0].x,sPoints[0].y);

        for(let i=1;i<sPoints.length;i++){
          ctx.lineTo(sPoints[i].x,sPoints[i].y);
        }
        ctx.stroke();
    }
}

export function undo(ctx,canvas){
  if(undoStack.length === 0)return;
  const stroke = undoStack.pop();
  redoStack.push(stroke);

  redrawCanvas(ctx,canvas);
}

 export function redo(ctx,canvas){
  if(redoStack.length === 0)return;
  const stroke = redoStack.pop();
  undoStack.push(stroke);
  redrawCanvas(ctx,canvas);
 }