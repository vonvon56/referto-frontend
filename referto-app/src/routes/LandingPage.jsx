import { useState } from 'react';
import landingimage from '../assets/images/landingimage.png';
import hyeri from '../assets/images/hyeri.jpg';
import yebin from '../assets/images/yebin.jpg';
import eunjae from '../assets/images/eunjae.jpg';
import gyeongseo from '../assets/images/gyeongseo.jpg';
import capture from '../assets/images/capture.png';
import { CircleCheckBig } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FileUploadModal from '../components/Modals/FileUpload';
import { Upload } from 'lucide-react';

const LandingPage = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [testReferencesList, setTestReferencesList] = useState([
    {
      APA: "Kim, J., & Lee, S. (2023). The impact of artificial intelligence on modern society. Journal of Technology, 45(2), 112-125.",
    },
    {
      APA: "Park, M. H. (2024). Understanding digital transformation in education. Educational Technology Review, 18(1), 23-40.",
    },
    {
      APA: "Choi, H. W., & Jung, Y. S. (2022). Sustainable development in smart cities: A systematic review. Urban Studies Quarterly, 30(4), 567-589.",
    }
  ]);
  const navigate = useNavigate();

  const teamMembers = [
    { 
      name: "박혜리", 
      role: "대장", 
      description: "얘들아 밥 빨리 먹고 일하자 ^^", 
      image: hyeri
    },
    { 
      name: "이은재", 
      role: "프론트!", 
      description: "제 2024 여름은 레퍼투입니다. ('2024 여름' === 'REFERTO')",
      image: eunjae
    },
    { 
      name: "편예빈", 
      role: "베짱이, 간식팀장", 
      description: "참외가 제일 잘나가~", 
      image: yebin
    },
    { 
      name: "황경서", 
      role: "백엔드 인부", 
      description: "열심히 삽질 중입니다.", 
      image: gyeongseo
    }
  ];

  const animations = {
    fadeInUp: {
      hidden: { opacity: 0, y: 30 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6 }
      }
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration: 0.6 }
      }
    },
    staggerContainer: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.2,
          delayChildren: 0.3
        }
      }
    },
    scaleOnHover: {
      hover: { scale: 1.05 },
      tap: { scale: 0.95 }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={animations.staggerContainer}
        className="w-full px-4 py-16 sm:py-20 md:py-24 lg:py-32 sm:px-8 lg:px-16 bg-gradient-to-b from-neutral-50 via-[#7e7e7e] to-neutral-900 flex flex-col items-center"
      >
        <div className="w-full flex flex-col items-center gap-4 sm:gap-6">
          <motion.div 
              variants={animations.fadeInUp}
              className="text-center text-neutral-900 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"
            >
            참고문헌 왜 혼자 써?
          </motion.div>
          <div className="w-full flex justify-center">
            <motion.div 
              variants={animations.fadeIn}
              className="text-center text-neutral-600 text-lg sm:text-xl md:text-2xl font-medium"
            >
              REFERTO와 함께 쉽고 빠르게 참고문헌을 생성하고 관리해보세요.
            </motion.div>
          </div>
        </div>
        <div className="w-full flex justify-center mt-8 sm:mt-10 md:mt-12">
          <motion.div
            variants={animations.fadeInUp}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-neutral-900 rounded-md text-center text-white text-base sm:text-lg md:text-xl font-medium cursor-pointer"
            onClick={() => navigate('/account/login')}
          >
            시작하기
          </motion.div>
        </div>
                
        <motion.img 
          variants={animations.fadeInUp}
          className="w-[90%] mt-12 sm:mt-16 md:mt-20 max-w-[600px] lg:max-w-[800px] h-auto"
          src={landingimage}
          alt="research paper"
        />
      </motion.div>
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={animations.staggerContainer}
        className="w-full py-20 lg:py-32 md:py-24 sm:py-16 px-4 lg:px-16 bg-neutral-900 flex flex-col items-center gap-20"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-[27px]"
        >
          <div className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-semibold leading-tight tracking-tight">주요 기능</div>
        </motion.div>
                
        <motion.div 
          initial="hidden"
          whileInView="visible"
          variants={animations.staggerContainer}
          className="h-full flex flex-col lg:flex-row justify-center items-center gap-[100px] md:gap-[50px] sm:gap-[30px]"
        > 
          <motion.img 
            variants={animations.fadeInUp}
            className="w-[800px] lg:w-[600px] md:w-[90%] h-auto"
            src={capture}
            alt="key features"
          />
          <div className="p-5 flex flex-col justify-start lg:items-start items-center gap-[50px]">
            {[
              { title: '참고문헌 생성', description: '파일을 업로드하기만 하면 양식에 따라 참고문헌 자동 생성!' },
              { title: '과제 관리', description: '내 과제와 참고문헌을 한 번에 관리할 수 있어요.' },
              { title: '메모 추가', description: '참고문헌에 하이라이팅과 메모를 표시하고 각주와 함께 복사해보세요.' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={animations.fadeInUp}
                className="flex flex-col gap-2.5 lg:items-start items-center"
              >
                <div className="flex flex-row gap-[12px] items-center">
                  <CircleCheckBig className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                  <div className="text-white text-lg sm:text-xl md:text-2xl font-medium leading-normal tracking-tight">{feature.title}</div>
                </div>
                <div className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-normal leading-normal tracking-tight lg:text-left text-center">
                  {feature.description.split('\n').map((line, index) => (
                    <span key={index}>{line}<br /></span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={animations.staggerContainer}
        className="w-full py-20 lg:py-32 md:py-24 sm:py-16 px-4 lg:px-16 bg-white flex flex-col items-center gap-20"
      >
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-[27px]"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-neutral-900 text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-semibold leading-tight tracking-tight lg:text-left text-center"
          >
            지금 바로 체험해보세요
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-neutral-600 text-base sm:text-lg md:text-xl leading-relaxed text-center"
          >
            로그인 없이 REFERTO의 주요 기능을 체험해볼 수 있습니다.<br/>
            PDF 파일을 업로드하고 생성된 참고문헌을 확인해보세요.
          </motion.div>
          <div className="w-full flex justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-fit px-6 py-3 bg-neutral-900 rounded-md flex items-center gap-2 text-white text-xl font-medium cursor-pointer"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <Upload className="w-5 h-5" />
              파일 업로드하기
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-8 w-full max-w-3xl"
        >
          {testReferencesList.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full p-6 bg-neutral-50 rounded-lg border border-neutral-200"
            >
              <div className="font-semibold mb-4 text-xl">생성된 참고문헌</div>
              {testReferencesList.map((ref, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100 
                  }}
                  whileHover={{
                    scale: 1.01,
                    backgroundColor: "#f8f8f8",
                    transition: { duration: 0.2 }
                  }}
                  className="p-3 bg-white rounded mb-2 shadow-sm cursor-pointer"
                >
                  {ref.APA}
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={animations.staggerContainer}
        className="w-full py-20 lg:py-32 md:py-24 sm:py-16 px-4 lg:px-16 bg-neutral-200 flex flex-col items-center gap-20"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-neutral-900 text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-semibold leading-tight tracking-tight"
        >
          팀 소개
        </motion.div>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          variants={animations.staggerContainer}
          className="w-full flex justify-center items-start gap-[23px] flex-wrap px-16"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={animations.fadeInUp}
              whileHover={animations.scaleOnHover}
              className="flex flex-col justify-start items-center gap-5 w-full sm:w-[300px]"
            >
              <div className="w-full sm:w-[300px] h-auto min-h-[230px] p-10 sm:p-6 bg-[#181818] rounded-[10px] border border-[#dedede] flex flex-col justify-start items-start gap-[30px]">
                <div className="flex items-center gap-[13px]">
                  <div className="w-[50px] h-[50px] flex items-center justify-center">
                    <img className="w-[50px] h-[50px] rounded-full" src={member.image} alt={member.name} />
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="text-white text-sm sm:text-base font-semibold leading-normal tracking-tight">
                      {member.name}
                    </div>
                    <div className="text-white text-sm sm:text-base font-medium leading-normal tracking-tight">
                      {member.role}
                    </div>
                  </div>
                </div>
                <div className="text-white text-sm sm:text-base font-normal leading-normal tracking-tight">
                  {member.description}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          variants={animations.fadeIn}
          className="w-full py-8 bg-neutral-200 gap-2 flex flex-col items-center px-4 lg:px-16"
        >
          <div className="w-[90%] mx-auto items-center border-t border-neutral-400 py-4"></div>
          <div className="px-16 w-full flex flex-col items-center">
            <div className="text-neutral-600 text-xl sm:text-2xl font-bold mb-2">REFERTO</div>
            <div className="text-neutral-600 text-sm sm:text-base">© 2024 REFERTO</div>
          </div>
        </motion.div>

        {isUploadModalOpen && (
          <FileUploadModal 
            setIsOpen={setIsUploadModalOpen}
            isLandingPage={true}
            setTestReferencesList={setTestReferencesList}
          />
        )}
    </div>
  );
}

export default LandingPage;
