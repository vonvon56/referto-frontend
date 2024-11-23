import { useState, useEffect } from "react";
import ReferenceItemDetail from "../components/Reference/itemdetail";
import { useLocation, useNavigate } from "react-router-dom";
import PDFViewer from "../components/PDFView";
import ReferenceMemo from "../components/memos/memo";
import { getPaper } from "../apis/api";

const DetailPage = ({ setIsDetailPage }) => {
  const location = useLocation();
  const {
    index,
    reference,
    selectedStyleName,
    referenceId,
    referenceName,
    assignmentId,
    paperId,
    referencesList,
  } = location.state || {};

  const [paperUrl, setPaperUrl] = useState(null);
  const [content, setContent] = useState(referenceName);
  const navigate = useNavigate();

  useEffect(() => {
    setIsDetailPage(true);
    const fetchPaper = async () => {
      try {
        if (paperId) {
          const paperBlobUrl = await getPaper(paperId);
          setPaperUrl(paperBlobUrl);
        }
      } catch (error) {
        console.error("Error fetching paper:", error);
      }
    };
    fetchPaper();
  }, [paperId]);

  const handlePrevPage = () => {
    if (index > 1) {
      const newReference = referencesList[index - 1];
      const newReferenceId = newReference["paperInfo_id"];
      navigate(`/${assignmentId}/${newReferenceId}`, {
        state: {
          ...location.state,
          index: index - 1,
          reference: newReference,
          referenceId: newReferenceId,
          referenceName: newReference[selectedStyleName],
          paperId: newReference["paper"],
        },
      });
    }
  };

  const handleNextPage = () => {
    if (index < referencesList.length - 1) {
      const newReference = referencesList[index + 1];
      const newReferenceId = newReference["paperInfo_id"];
      navigate(`/${assignmentId}/${newReferenceId}`, {
        state: {
          ...location.state,
          index: index + 1,
          reference: newReference,
          referenceId: newReferenceId,
          referenceName: newReference[selectedStyleName],
          paperId: newReference["paper"],
        },
      });
    }
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-[100px] pt-6 sm:pt-[50px] pb-8 sm:pb-[100px] flex flex-col">
      <ReferenceItemDetail
        index={index}
        referenceId={referenceId}
        referenceName={referenceName}
        content={content}
        setContent={setContent}
        selectedStyleName={selectedStyleName}
        assignmentId={assignmentId}
        paperId={paperId}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
      />
      
      {/* Main content area */}
      <div className="w-full flex-1 flex flex-col lg:flex-row gap-4">
        {/* PDF Viewer Section */}
        <div className="w-full lg:w-2/3 p-3 sm:p-5">
          <div className="w-full h-full rounded-lg border border-neutral-400 p-2 sm:p-3">
            {paperUrl ? (
              <PDFViewer pdfUrl={paperUrl} />
            ) : (
              <div className="text-sm sm:text-base">파일 로딩 중...</div>
            )}
          </div>
        </div>

        {/* Memo Section */}
        <div className="w-full lg:w-1/3 p-3 sm:p-5">
          <div className="w-full h-full">
            <ReferenceMemo paperId={paperId} content={content} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
