import nvision from '@nipacloud/nvision';
import { NvisionRequest } from '@nipacloud/nvision/dist/models/NvisionRequest';
import getConfig from 'next/config';
import React, { useEffect, useState } from 'react';
import ReactResizeDetector from 'react-resize-detector';
import styled from 'styled-components';

import { PositionObj } from '../src/type/custom';

const { publicRuntimeConfig } = getConfig();

const Background = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ButtonSelectFile = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 180px;
  color: #c0212f;
  background-color: #ffffff;
  border: 1px solid #ced4da;
  margin: 0 auto;
  border-radius: 8px;
  cursor: pointer;
  &:hover,
  &:hover i {
    color: #ffffff;
    background-color: #c0212f;
  }
  & span {
    font-family: 'Kanit';
  }
`;
const Icon = styled.i`
  font-size: 20px;
  color: #c0212f;
  margin-right: 16px;
`;
const InputFile = styled.input`
  display: none;
`;
const BlockImage = styled.div`
  position: relative;
`;
const Canvas = styled.canvas<{ width: number; height: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

const HomePage = () => {
  const [srcImg, setSrcImage] = useState('/preview.jpg');
  const [selectedImg, setSelectedImg] = useState(false);
  const [imgDimension, setImgDimension] = useState({ width: 0, height: 0 });

  const imgToBase64 = (url: string): Promise<string> =>
    fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.toString());
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          }),
      );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const canvasRect = (positionObj: PositionObj[]) => {
    // console.log(positionObj);
    const canvas = document.querySelector('#preview-canvas') as HTMLCanvasElement;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    console.log('canvas', imgDimension);
    // ctx.beginPath();
    // positionObj.forEach((data) => {
    //   const { bounding_box: box, name } = data;
    //   ctx.strokeRect(box.left, box.top, 80, 80);
    //   ctx.font = '12px Arial';
    //   ctx.fillText(name, box.left, box.top - 4);
    // });
    // ctx.stroke();

    // const { bounding_box: box } = positionObj[0];
    // console.log(box);
    // console.log('canvas', { imgWidth, imgHeight });
    // console.log('move', box.top, imgWidth - box.right);
    ctx.beginPath();
    // ctx.moveTo(box.top, imgWidth - box.right);
    // ctx.lineTo(box.top, box.right);
    // ctx.lineTo(box.right, box.bottom);
    // ctx.lineTo(box.bottom, box.left);
    // ctx.lineTo(box.left, box.top);
    // ctx.closePath();
    // ctx.stroke();
    // positionObj.forEach((data) => {
    //   const { bounding_box: box } = data;
    //   ctx.beginPath();
    //   ctx.moveTo(box.left, box.top);
    //   ctx.lineTo(box.top, box.right);
    //   ctx.lineTo(box.right, box.bottom);
    //   ctx.lineTo(box.bottom, box.left);
    //   ctx.lineTo(box.left, box.top);
    //   ctx.closePath();
    //   ctx.stroke();
    // });
  };

  const sendToML = (base64: string): Promise<NvisionRequest> => {
    const objectDetectionService = nvision.objectDetection({
      apiKey: publicRuntimeConfig.NVISION_KEY,
    });
    return objectDetectionService.predict({
      rawData: base64,
    });
  };

  const handleSelectFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if ((event.target as HTMLInputElement).files.length) {
      const file = (event.target as HTMLInputElement).files[0];
      const preview = URL.createObjectURL(file);
      setSrcImage(preview);
      setSelectedImg(true);
      let base64: string = await imgToBase64(preview);
      base64 = base64.replace(/^data:image\/[a-z]+;base64,/, '');
      try {
        const positionArr = await sendToML(base64);
        canvasRect(positionArr.detected_objects);
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  useEffect(() => {
    if (selectedImg) {
      console.log('update', imgDimension);
    }
    return () => {};
  }, [selectedImg]);

  return (
    <Background>
      <div>
        <ReactResizeDetector
          handleWidth
          onResize={(width, height) => {
            setImgDimension({
              width,
              height: height - 4,
            });
          }}
        >
          <BlockImage>
            <img src={srcImg} alt="preview" />
            <Canvas width={imgDimension.width} height={imgDimension.height} id="preview-canvas" />
          </BlockImage>
        </ReactResizeDetector>
        <ButtonSelectFile htmlFor="file-image">
          <Icon className="far fa-image" />
          <span>Select Image</span>
        </ButtonSelectFile>
        <InputFile
          type="file"
          name="file-image"
          id="file-image"
          accept="image/jpeg,image/x-png"
          onChange={handleSelectFile}
        />
      </div>
    </Background>
  );
};

export default HomePage;
