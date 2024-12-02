import { FileUp, X } from "lucide-react";
import { useState, useRef } from "react";
import { uploadPaper, uploadPaperInfo, testUploadPaper } from "../../apis/api";
import { useParams } from "react-router-dom";
import Loading from "./loading";
import AlertModal from "./AlertModal";
import SuccessModal from "./SuccessModal";
import alertCircle from "../../assets/images/alert-circle.svg";

const FileUploadModal = ({ setIsOpen, isLandingPage, setTestReferencesList, onUploadSuccess }) => {
  const [uploadStatus, setUploadStatus] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorAlertModalIsOpen, setErrorAlertModalIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [uploadSuccessModalIsOpen, setUploadSuccessModalIsOpen] =
    useState(false);
  const fileInputRef = useRef(null);
  const { assignmentId } = useParams();

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (files) => {
    if (!files || files.length === 0) return;

    setUploadStatus(true);
    setIsVisible(false);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      if (isLandingPage) {
        const formData = new FormData();
        formData.append("pdf", files[0]);

        try {
          const response = await testUploadPaper(formData, config);
          const references = [response.data.paper_info];
          setTestReferencesList(references);
          setUploadStatus(false);
          setUploadSuccessModalIsOpen(true);
          if (onUploadSuccess) onUploadSuccess();
          setTimeout(() => {
            setIsOpen(false);
          }, 1000);
        } catch (error) {
          console.error('Landing page upload error:', error);
          setErrorAlertModalIsOpen(true);
          setUploadStatus(false);
        }
        return;
      }

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("pdf", files[i]);
        formData.append("assignment", assignmentId);

        try {
          console.log('Uploading file:', files[i].name);
          console.log('FormData:', {
            pdf: formData.get('pdf'),
            assignment: formData.get('assignment')
          });

          const response_paper = await uploadPaper(formData, config);
          console.log('Upload successful:', response_paper);

          const response_paperinfo = await uploadPaperInfo(
            response_paper.data.paper_id
          );
          console.log('Paper info updated:', response_paperinfo);
        } catch (error) {
          console.error('Upload error:', error);
          if (error.data) {
            console.error('Server error details:', error.data);
          }
          setErrorAlertModalIsOpen(true);
          setUploadStatus(false);
          return;
        }
      }

      setUploadStatus(false);
      setUploadSuccessModalIsOpen(true);
      setTimeout(() => {
        setIsOpen(false);
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Process error:', error);
      setErrorAlertModalIsOpen(true);
      setUploadStatus(false);
    }
  };

  const handleErrorAlertCancel = () => {
    setErrorAlertModalIsOpen(false);
    setIsOpen(false);
    window.location.reload();
  };
  // Drag and Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    
    if (isLandingPage && files.length > 1) {
      // 랜딩페이지에서 여러 파일을 드래그했을 때 처리
      setErrorAlertModalIsOpen(true);
      return;
    }
    
    handleFileChange(files);
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    
    if (isLandingPage && files.length > 1) {
      // 랜딩페이지에서 여러 파일을 선택했을 때 처리
      setErrorAlertModalIsOpen(true);
      return;
    }
    
    handleFileChange(files);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 overflow-hidden">
      <div
        className={`w-[90%] sm:w-[600px] h-auto px-4 sm:px-8 py-6 sm:py-8 bg-white rounded-2xl shadow flex-col justify-start items-start gap-5 sm:gap-7 inline-flex ${
          !isVisible ? "hidden" : ""
        }`}
      >
        <div className="h-auto self-stretch flex-col justify-center items-start gap-2 inline-flex">
          <div className="self-stretch justify-between items-start inline-flex">
            <div className="text-neutral-900 text-xl sm:text-2xl font-semibold font-['Pretendard'] leading-normal sm:leading-[33.60px]">
              파일 업로드
            </div>
            <X
              className="w-[18px] sm:w-[20px] h-[18px] sm:h-[20px] relative cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          </div>
        </div>
        <input
          type="file"
          multiple={!isLandingPage}
          accept=".pdf"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleInputChange}
        />
        <div
          className={`self-stretch px-2 sm:px-2.5 py-4 sm:py-6 bg-neutral-50 rounded border border-2 border-dashed border-neutral-300 flex-col justify-center items-center gap-1 flex cursor-pointer ${
            isDragOver ? "bg-neutral-400" : ""
          }`}
          onClick={handleUploadClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="self-stretch flex-col justify-start items-center gap-2 flex">
            <FileUp className="w-6 sm:w-8 h-6 sm:h-8 text-neutral-300" />
            <div className="self-stretch text-center text-neutral-300 text-xs sm:text-sm font-medium font-['Pretendard'] leading-none">
              pdf 첨부 가능
            </div>
            <div className="self-stretch text-center text-neutral-300 text-xs sm:text-sm font-medium font-['Pretendard'] leading-none">
              {isLandingPage 
                ? "PDF 파일 하나를 선택해주세요."
                : "클릭하거나 업로드할 파일을 드롭하세요."
              }
            </div>
          </div>
        </div>
      </div>
      {uploadStatus && <Loading />}
      {errorAlertModalIsOpen && (
        <AlertModal
          icon={alertCircle}
          color={"#EF4444"}
          handleAlertCancel={handleErrorAlertCancel}
          text={"파일 업로드 중 에러가 발생했습니다. 다시 시도해주세요."}
        />
      )}
      {uploadSuccessModalIsOpen && (
        <SuccessModal
          text={"파일 업로드 성공!"}
          setModalOpen={setUploadSuccessModalIsOpen}
        />
      )}
    </div>
  );
};

export default FileUploadModal;
