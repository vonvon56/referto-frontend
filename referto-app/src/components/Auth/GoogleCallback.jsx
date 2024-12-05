import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUser, getAssignments } from '../../apis/api';

const GoogleCallback = ({ setIsUserLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('[GoogleCallback] Starting callback handling');
        
        const params = new URLSearchParams(location.search);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        
        console.log('[GoogleCallback] Tokens from URL:', { accessToken, refreshToken });

        if (accessToken && refreshToken) {
          // Store tokens
          document.cookie = `access_token=${accessToken}; path=/`;
          document.cookie = `refresh_token=${refreshToken}; path=/`;
          
          // Get user data and first assignment
          const user = await getUser();
          console.log('[GoogleCallback] User data:', user);
          
          // 로그인 상태 업데이트
          setIsUserLoggedIn(true);
          
          const assignments = await getAssignments();
          console.log('[GoogleCallback] Assignments:', assignments);
          
          if (assignments && assignments.length > 0) {
            const firstAssignmentId = assignments[0].assignment_id;
            console.log('[GoogleCallback] Redirecting to assignment:', firstAssignmentId);
            navigate(`/${firstAssignmentId}`);
          } else {
            console.log('[GoogleCallback] No assignments found, redirecting to home');
            navigate('/');
          }
        } else {
          throw new Error('Missing tokens');
        }
      } catch (error) {
        console.error('[GoogleCallback] Error:', error);
        setIsUserLoggedIn(false);  // 에러 발생 시 로그인 상태 false로 설정
        navigate('/login', { 
          state: { error: '로그인에 실패했습니다. 다시 시도해주세요.' } 
        });
      }
    };

    handleCallback();
  }, [navigate, location, setIsUserLoggedIn]);

  return <div>로그인 처리중...</div>;
};

export default GoogleCallback; 