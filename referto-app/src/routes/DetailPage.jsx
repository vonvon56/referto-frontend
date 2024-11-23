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
  const [isMemoOpen, setIsMemoOpen] = useState(false);

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
    <div className="w-full h-screen overflow-y-auto">
      {/* Header (not sticky anymore) */}
      <div className="bg-white px-4 sm:px-[100px] pt-6 sm:pt-[50px]">
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
      </div>
      
      {/* Main Content */}
      <div className="px-4 sm:px-[100px] pb-8 sm:pb-[100px]">
        <div className="w-full h-full flex flex-col lg:flex-row gap-4">
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

          {/* Desktop Memo Section */}
          <div className="hidden lg:block w-1/3 p-3 sm:p-5">
            <div className="w-full h-full">
              <ReferenceMemo paperId={paperId} content={content} />
            </div>
          </div>

          {/* Mobile Memo Handler */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 flex flex-col items-center">
            <button
              className="bg-white w-full px-4 py-2 border-t border-gray-200 flex items-center justify-center"
              onClick={() => setIsMemoOpen(!isMemoOpen)}
            >
              <div className="w-12 h-1 bg-gray-300 rounded-full mb-1" />
            </button>
          </div>

          {/* Mobile Memo Modal */}
          {isMemoOpen && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
              <div className="absolute bottom-0 w-full bg-white rounded-t-2xl p-4 animate-slide-up">
                <button
                  className="w-full flex justify-center mb-2"
                  onClick={() => setIsMemoOpen(false)}
                >
                  <div className="w-12 h-1 bg-gray-300 rounded-full" />
                </button>
                <ReferenceMemo paperId={paperId} content={content} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
