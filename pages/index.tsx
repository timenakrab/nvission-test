import nvision from '@nipacloud/nvision';
import { NvisionRequest } from '@nipacloud/nvision/dist/models/NvisionRequest';
import getConfig from 'next/config';
import React, { useEffect, useState } from 'react';
import ReactResizeDetector from 'react-resize-detector';
import styled from 'styled-components';
import Swal from 'sweetalert2';

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
const Canvas = styled.canvas<{ width: number; height: number; show: boolean }>`
  display: ${(props) => (props.show ? 'block' : 'none')};
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
  const [positions, setPositions] = useState<PositionObj[]>([]);

  function randomColorRGBA() {
    const x = Math.floor(Math.random() * 256);
    const y = Math.floor(Math.random() * 256);
    const z = Math.floor(Math.random() * 256);
    return `rgba(${x},${y},${z},1)`;
  }

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

  const canvasRect = (positionObj: PositionObj[]) => {
    const canvas = document.querySelector('#preview-canvas') as HTMLCanvasElement;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    ctx.font = '20px Arial';
    positionObj.forEach((data) => {
      const { bounding_box: box, name } = data;
      const color = randomColorRGBA();
      ctx.beginPath();
      ctx.moveTo(box.left, box.bottom); // left-bottom
      ctx.lineTo(box.left, box.top); // left-top
      ctx.lineTo(box.right, box.top); // left-bottom
      ctx.lineTo(box.right, box.bottom); // right- bottom
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.fillText(name, box.left + 4, box.top + 12);
    });
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
        if (positionArr?.service_id && positionArr?.detected_objects) {
          setPositions(positionArr.detected_objects);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      }
      setSelectedImg(false);
    }
  };

  useEffect(() => {
    if (selectedImg && positions?.length) {
      canvasRect(positions);
    }
    return () => {};
  }, [selectedImg, positions]);

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
            <img id="preview" src={srcImg} alt="preview" />
            <Canvas
              show
              width={imgDimension.width}
              height={imgDimension.height}
              id="preview-canvas"
            />
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
          accept="image/jpeg,image/png"
          onChange={handleSelectFile}
        />
      </div>
    </Background>
  );
};

export default HomePage;
