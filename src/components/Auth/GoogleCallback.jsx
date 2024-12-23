import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getUser, getAssignments } from '../../apis/api';
import { login, setUser } from '../../redux/authSlice';
import { removeCookie } from '../../utils/cookie';
import { store } from '../../redux/store';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        console.log('[GoogleCallback] Starting auth success handling');
        const userData = await getUser();
        console.log('[GoogleCallback] User data received:', userData);
        
        if (!userData.email) {
          console.error('[GoogleCallback] No email in user data:', userData);
          throw new Error('No email in user data');
        }

        dispatch(login());
        dispatch(setUser(userData));
        
        console.log('[GoogleCallback] Redux state after dispatch:', store.getState());

        const assignments = await getAssignments();
        console.log('[GoogleCallback] Assignments received:', assignments);
        
        if (assignments && assignments.length > 0) {
          navigate(`/${assignments[0].assignment_id}`);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('[GoogleCallback] Auth success handling error:', error);
        dispatch(logout());
        removeCookie('access_token');
        removeCookie('refresh_token');
        navigate('/account/login');
      }
    };

    handleAuthSuccess();
  }, [dispatch, navigate]);

  return <div>구글 로그인 처리중...</div>;
};

export default GoogleCallback; 