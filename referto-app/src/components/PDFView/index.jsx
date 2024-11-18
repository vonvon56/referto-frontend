import React, { useState, useRef, useEffect } from "react";
import { getNotes, createNote, deleteNote } from "../../apis/api";
import { Trash2 } from "lucide-react";
import {
  Worker,
  Viewer,
  SpecialZoomLevel,
  Button,
  Position,
  Tooltip,
} from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";
import packageJson from "../../../package.json";
import { highlightPlugin, MessageIcon } from "@react-pdf-viewer/highlight";

const PDFViewer = ({ pdfUrl, paperId }) => {
  const pdfjsVersion = packageJson.dependencies["pdfjs-dist"];
  const [message, setMessage] = useState(""); //현재 쓰고 있는 메시지
  const [notes, setNotes] = useState([]); //전체 note list
  const noteEles = useRef(new Map());
  const [currentDoc, setCurrentDoc] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const getNoteAPI = async () => {
      const notes = await getNotes(paperId);
      setNotes(notes);
      console.log(notes);
    };
    getNoteAPI();
  }, [paperId]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleNoteDelete = async (noteId) => {
    await deleteNote(noteId);
    const updatedNotes = await getNotes(paperId);
    setNotes(updatedNotes);
  };

  // Initialize the plugins
  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget: (
      { selectionRegion, toggle } //how the interface looks when the user selects text or triggers the highlight tool
    ) => (
      <div
        style={{
          background: "#eee",
          display: "flex",
          position: "absolute",
          left: `${selectionRegion.left}%`,
          top: `${selectionRegion.top + selectionRegion.height}%`,
          transform: "translate(0, 8px)",
          zIndex: 1000,
        }}
      >
        <Tooltip
          position={Position.TopCenter}
          target={
            <Button
              onClick={toggle}
              className="bg-[#E5E5E5] text-[#171717] rounded cursor-pointer z-[1000]"
            >
              <MessageIcon />
            </Button>
          }
          content={() => (
            <div
              className="font-[Pretendard]"
              style={{
                width: "120px",
                padding: "8px",
                background: "white",
                color: "#171717",
              }}
            >
              메모 추가하기
            </div>
          )}
          offset={{ left: 0, top: -8 }}
        />
      </div>
    ),
    renderHighlightContent: ({
      //interface for adding a note to the highlighted area.
      selectionRegion,
      highlightAreas,
      selectedText,
      cancel,
    }) => {
      const addNote = async () => {
        if (message !== "") {
          const note = {
            content: message,
            highlightAreas,
            quote: selectedText,
          };
          await createNote(paperId, note);
          setNotes((prevNotes) => [...prevNotes, note]);
          setMessage("");
          cancel();
        }
      };

      return (
        <div
          id="Note_input"
          style={{
            background: "#fff",
            border: "1px solid rgba(0, 0, 0, .3)",
            borderRadius: "2px",
            padding: "8px",
            position: "absolute",
            left: `${selectionRegion.left}%`,
            top: `${selectionRegion.top + selectionRegion.height}%`,
            zIndex: 1,
          }}
        >
          <div>
            <textarea
              rows={3}
              className="border border-[rgba(0,0,0,0.3)] w-full box-border p-1"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "8px",
            }}
          >
            <div style={{ marginRight: "8px" }}>
              <Button
                onClick={addNote}
                style={{
                  background: "#007bff",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "4px 8px",
                }}
              >
                추가
              </Button>
            </div>
            <Button
              onClick={cancel}
              style={{
                background: "#6c757d",
                color: "#fff",
                borderRadius: "4px",
                padding: "4px 8px",
              }}
            >
              취소
            </Button>
          </div>
        </div>
      );
    },
    renderHighlights: (
      { pageIndex, getCssProperties, rotation } //renders the highlights on the document/page and allows interaction with them.
    ) => (
      <div>
        {notes.map((note) => (
          <React.Fragment key={note.id}>
            {note.highlightAreas
              .filter((area) => area.pageIndex === pageIndex)
              .map((area, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "yellow",
                    opacity: 0.4,
                    ...getCssProperties(area, rotation),
                  }}
                  onClick={() => jumpToNote(note)}
                  ref={(ref) => {
                    noteEles.current.set(note.id, ref);
                  }}
                />
              ))}
          </React.Fragment>
        ))}
      </div>
    ),
  });

  const handleDocumentLoad = (e) => {
    setCurrentDoc(e.doc);
    if (currentDoc && currentDoc !== e.doc) {
      setNotes([]);
    }
  };

  const jumpToHighlightArea = (highlightArea) => {
    if (currentDoc) {
      currentDoc.getPage(highlightArea.pageIndex + 1).then((pdfPage) => {
        const viewport = pdfPage.getViewport({ scale: 1 });
        const left = highlightArea.left * viewport.width;
        const top = highlightArea.top * viewport.height;
        window.scrollTo({
          top,
          left,
          behavior: "smooth",
        });
      });
    }
  };

  const jumpToNote = (note) => {
    if (noteEles.current.has(note.id)) {
      noteEles.current.get(note.id).scrollIntoView({ behavior: "smooth" });
    }
  };

  const Sidebar = ({ notes, jumpToHighlightArea }) => (
    <div className="w-[250px] h-100% text-neutral-900 font-[Pretendard] font-bold py-2 pl-3 overflowY-auto">
      메모
      {notes.map((note) => (
        <div
          key={note.note_id}
          onClick={() => jumpToHighlightArea(note.highlightAreas[0])}
          className="cursor-pointer p-4 pb-4 border-2 border-neutral-300 m-2 rounded-md shadow-md"
        >
          <div className="flex justify-end my-2">
            <Trash2
              className="text-red-400 w-4 h-4 mb-2"
              onClick={(e) => {
                e.stopPropagation();
                handleNoteDelete(note.note_id);
                console.log(note.note_id);
              }}
            />
          </div>
          <div className="text-neutral-500 font-[Pretendard] font-medium">
            {note.quote}
          </div>
          <div className="text-neutral-900 font-[Pretendard] font-medium">
            {note.content}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh" }}>
      <div style={{ flex: 1, position: "relative" }}>
        <Worker
          workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}
        >
          <Viewer
            fileUrl={pdfUrl}
            defaultScale={SpecialZoomLevel.PageFit}
            plugins={[highlightPluginInstance]}
            onDocumentLoad={handleDocumentLoad}
          />
        </Worker>
        <button
          onClick={toggleSidebar}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "8px 12px",
            background: "#171717",
            color: "#fff",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {showSidebar ? "메모 닫기" : "메모 보기"}
        </button>
      </div>
      {showSidebar && (
        <Sidebar notes={notes} jumpToHighlightArea={jumpToHighlightArea} />
      )}
    </div>
  );
};

export default PDFViewer;
