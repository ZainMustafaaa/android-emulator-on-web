// const Canvas = props => {

//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = ( canvas || { getContext: () => {}} ).getContext('2d');
  

//     // context.fillStyle = '#000000'
//     // context.fillRect(0, 0, context.canvas.width, context.canvas.height);
//     const img = document.createElement('img');
//     img.style.width = "100px"

//     img.src = `data:image/jpeg;base64,${props.data}`;

//     console.log('img ', img)
//     context.drawImage(img, 0, 0)
//     console.log(context)
//   })

  
//   return <canvas ref={canvasRef} {...props}></canvas>
// }