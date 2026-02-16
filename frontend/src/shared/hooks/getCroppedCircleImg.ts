import { Area } from 'react-easy-crop';

export async function getCroppedCircleImg(imageSrc: string, crop: Area): Promise<Blob> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise(resolve => { image.onload = resolve; });

  const canvas = document.createElement('canvas');
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d')!;

  // Recorta el área cuadrada
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  // Crea una máscara circular
  const circleCanvas = document.createElement('canvas');
  circleCanvas.width = crop.width;
  circleCanvas.height = crop.height;
  const circleCtx = circleCanvas.getContext('2d')!;
  
  circleCtx.beginPath();
  circleCtx.arc(crop.width / 2, crop.height / 2, crop.width / 2, 0, 2 * Math.PI);
  circleCtx.closePath();
  circleCtx.clip();
  circleCtx.drawImage(canvas, 0, 0);

  return new Promise((resolve) => {
    circleCanvas.toBlob(blob => resolve(blob!), 'image/png');
  });
}
