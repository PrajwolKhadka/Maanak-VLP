import '@testing-library/jest-dom';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/store/authStore';
const mockUser = {
  id: '1', username: 'testuser', email: 'test@test.com', streak: 0,
};

describe('Auth Store', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null });
  });

  it('should set auth correctly', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => result.current.setAuth(mockUser, 'testtoken'));
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe('testtoken');
  });

  it('should logout and clear state', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => result.current.setAuth(mockUser, 'testtoken'));
    act(() => result.current.logout());
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('should update user', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => result.current.setAuth(mockUser, 'testtoken'));
    act(() => result.current.updateUser({ ...mockUser, username: 'updated' }));
    expect(result.current.user?.username).toBe('updated');
  });

  it('should have null user initially', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
  });

  it('should have null token initially', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.token).toBeNull();
  });
});