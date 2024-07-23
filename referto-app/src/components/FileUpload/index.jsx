import { Upload, Loader } from "lucide-react";
import { useState, useRef } from "react";
// import SelectStyleModal from "../Modals/SelectStyle";
import { createMemo, uploadPaper, uploadPaperInfo } from "../../apis/api";
import { useParams } from "react-router-dom";

const FileUpload = () => {
  const [uploadStatus, setUploadStatus] = useState("");
  const fileInputRef = useRef(null);

  // const [isOpen, setIsOpen] = useState(false);
  // const handleUploadClick = () => {
  //   setIsOpen(true);
  // };
  // const handleCloseClick = () => {
  //   setIsOpen(false);
  // };

  const { assignmentId } = useParams();

  const handleFileChange = async (e) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    setUploadStatus("ing");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const formData = new FormData();
        formData.append("pdf", selectedFiles[i]);
        formData.append("assignment", assignmentId);
  
        const response_paper = await uploadPaper(formData, config);
        console.log("File uploaded successfully");

        await uploadPaperInfo(response_paper.data.paper_id);
        // const response_memo = await createMemo(response_paper.data.paper_id);
        console.log("Paper info uploaded successfully");
      }
      window.location.reload();
      // console.log("파일 업로드시 paper정보 확인하기: ", response.data);
      //response2.paper_info 안에 paperinfo_id, mla_reference, apa_reference, 등이 있음.
      //위 console.log() 코드를 돌리면 계속 어떤 형식으로 response 가 나오는지 보여줄거야!
      //mla 만 나오도록 한거는 components -> reference -> item.jsx 에 있어 (const referenceName = reference.mla_reference;)
      //apa mla .. 중에서 어떤 스타일을 선택했는지는 components -> Style -> list.jsx 에 selectedStyleId 가 알려줄거야!
      //여기 response2.paper_info 를 (아마 HomePage.jsx 으로) 가져가서, 얘가 style 이 뭔지에 따라 reference item 이 다르게 나오도록 구현하면됑
    } catch (error) {
      console.error(
        "Error uploading file:",
        error.response ? error.response : error.message
      );
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <input
        type="file"
        multiple 
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <div
        className="px-4 py-2 bg-neutral-900 rounded-md justify-center items-center gap-2.5 flex cursor-pointer"
        onClick={handleUploadClick}
      >
        <div className="justify-center items-center gap-2.5 flex">
          {uploadStatus === "ing" ? (
            <Loader className="text-white selection:w-[18px] h-[18px] relative" />
          ) : (
            <Upload className="text-white selection:w-[18px] h-[18px] relative" />
          )}
        </div>
        <div className="text-right text-white text-lg font-light font-['Pretendard'] leading-normal">
          Upload
        </div>
      </div>
    </>
    //{isOpen && <SelectStyleModal onClose={handleCloseClick} onClick={handleUpload} />}
  );
};

export default FileUpload;
