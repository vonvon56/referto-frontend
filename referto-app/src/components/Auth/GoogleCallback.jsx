import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, logout, setUser } from '../../redux/authSlice';
import { getUser, getAssignments } from '../../apis/api';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('[GoogleCallback] Starting callback handling');
        
        dispatch(logout());
        dispatch(setUser(null));
        localStorage.clear();
        sessionStorage.clear();
        
        const params = new URLSearchParams(location.search);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        
        console.log('[GoogleCallback] Tokens from URL:', { accessToken, refreshToken });

        if (accessToken && refreshToken) {
          document.cookie = `access_token=${accessToken}; path=/`;
          document.cookie = `refresh_token=${refreshToken}; path=/`;
          
          const user = await getUser();
          console.log('[GoogleCallback] User data:', user);
          
          dispatch(login());
          dispatch(setUser(user));
          
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
        dispatch(logout());
        navigate('/login', { 
          state: { error: '로그인에 실패했습니다. 다시 시도해주세요.' } 
        });
      }
    };

    handleCallback();
  }, [navigate, location, dispatch]);

  return <div>로그인 처리중...</div>;
};

export default GoogleCallback; 