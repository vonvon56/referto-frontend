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
        const params = new URLSearchParams(location.search);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        
        if (!accessToken || !refreshToken) {
          throw new Error('토큰이 없습니다');
        }

        document.cookie = `access_token=${accessToken}; path=/`;
        document.cookie = `refresh_token=${refreshToken}; path=/`;
        
        const user = await getUser();
        dispatch(login());
        dispatch(setUser(user));
        
        const assignments = await getAssignments();
        if (assignments?.length > 0) {
          navigate(`/${assignments[0].assignment_id}`);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('[GoogleCallback] Error:', error);
        dispatch(logout());
        navigate('/account/login', { 
          state: { error: '로그인에 실패했습니다. 다시 시도해주세요.' } 
        });
      }
    };

    handleCallback();
  }, [navigate, location, dispatch]);

  return <div>로그인 처리중...</div>;
};

export default GoogleCallback; 