import { useRef, useEffect } from "react";
import { Pencil, Trash2, Check } from 'lucide-react';

const AssignmentModal = ({ position, setIsEdit, setIsOpen, setDeleteModalIsOpen }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsOpen]);

  return (
    <div 
      ref={modalRef}
      className="w-[90px] absolute bg-white rounded-lg shadow-lg py-1 z-10"
      style={{ 
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
    >
      <div 
        className="px-5 py-2 hover:bg-neutral-100 flex items-center gap-2 cursor-pointer"
        onClick={() => {
          setIsEdit(true);
          setIsOpen(false);
        }}
      >
        <Pencil className="w-4 h-4 text-neutral-500" />
        <span className="text-sm text-neutral-700 font-medium font-['Pretendard']">수정</span>
      </div>
      <div 
        className="px-5 py-2 hover:bg-neutral-100 flex items-center gap-2 cursor-pointer"
        onClick={() => {
          setDeleteModalIsOpen(true);
          setIsOpen(false);
        }}
      >
        <Trash2 className="w-4 h-4 text-red-400" />
        <span className="text-sm text-red-400 font-medium font-['Pretendard']">삭제</span>
      </div>
    </div>
  );
};

export default AssignmentModal;
