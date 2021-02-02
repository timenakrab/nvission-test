import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Background = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #f0f0f0;
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
  margin: 0px;
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
const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
`;

const mockResp = [
  {
    bounding_box: { bottom: 201, left: 9, right: 38, top: 129 },
    name: 'person',
    confidence: 0.9894000291824341,
    parent: 'human',
  },
  {
    bounding_box: { bottom: 201, left: 67, right: 106, top: 133 },
    name: 'person',
    confidence: 0.9958999752998352,
    parent: 'human',
  },
  {
    bounding_box: { bottom: 201, left: 27, right: 72, top: 131 },
    name: 'person',
    confidence: 0.9977999925613403,
    parent: 'human',
  },
  {
    bounding_box: { bottom: 215, left: 159, right: 218, top: 94 },
    name: 'person',
    confidence: 0.9986000061035156,
    parent: 'human',
  },
  {
    bounding_box: { bottom: 211, left: 124, right: 164, top: 114 },
    name: 'person',
    confidence: 0.9991000294685364,
    parent: 'human',
  },
  {
    bounding_box: { bottom: 227, left: 271, right: 349, top: 105 },
    name: 'person',
    confidence: 0.9994000196456909,
    parent: 'human',
  },
  {
    bounding_box: { bottom: 226, left: 199, right: 270, top: 88 },
    name: 'person',
    confidence: 0.9997000098228455,
    parent: 'human',
  },
];
let reactImageSize = null;

const HomePage = () => {
  const [srcImg, setSrcImage] = useState('/preview.jpg');

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
  const sendToML = (base64: string) => {
    // const objectDetectionService = nvision.objectDetection({
    //   apiKey:
    //     'cdb29f355cb4059995e054208c89cf3a667a9ced3a5e2a047d88c5d323a6e4fbf2c99ecfd01496e729446d925d16577aac',
    //   streamingKey:
    //     'cdb29f355cb4059995e054208a8acf3c372891ed3a0f2a097c88c5d778f6e4f8a9959fcfd64093ef7f106c950b455625ac',
    // });
    // objectDetectionService
    //   .predict({
    //     outputCroppedImage: false,
    //     confidenceThreshold: 0.2,
    //     rawData: base64,
    //   })
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((err) => {
    //     console.log(err.message);
    //   });

    const c = document.getElementById('preview-canvas') as HTMLCanvasElement;
    const ctx: CanvasRenderingContext2D = c.getContext('2d');
    ctx.beginPath();
    mockResp.forEach((data) => {
      const { bounding_box: box, name } = data;
      ctx.strokeRect(box.left, box.top, 80, 80);
      ctx.font = '12px Arial';
      ctx.fillText(name, box.left, box.top - 4);
    });
    ctx.stroke();
  };

  const handleSelectFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if ((event.target as HTMLInputElement).files.length) {
      const file = (event.target as HTMLInputElement).files[0];
      const preview = URL.createObjectURL(file);
      reactImageSize(preview).then((res) => {
        console.log(res);
      });
      // const { width, height } = await reactImageSize(preview);
      // console.log({ width, height });

      setSrcImage(preview);
      let base64: string = await imgToBase64(preview);
      base64 = base64.replace(/^data:image\/[a-z]+;base64,/, '');
      sendToML(base64);
    }
  };

  useEffect(() => {
    import('react-image-size').then(async (res) => {
      reactImageSize = res;
      console.log(reactImageSize);
    });
    return () => {};
  }, []);

  return (
    <Background>
      <div>
        <BlockImage>
          <img src={srcImg} alt="preview" />
          <Canvas id="preview-canvas" />
        </BlockImage>
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
