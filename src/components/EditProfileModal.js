import React, { useState } from 'react';
import { XIcon } from './Icons';

export default function EditProfileModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    bio: user?.bio || '', 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', 
      backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', 
      alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: '16px', width: '100%', maxWidth: '400px',
        padding: '24px', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px', 
            background: 'none', border: 'none', color: 'var(--secondary)', 
            cursor: 'pointer'
          }}
        >
          <XIcon />
        </button>

        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '24px' }}>Edit Profile</h2>

        {error && <div style={{color: 'red', marginBottom: '16px', fontSize: '0.9rem'}}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', color: 'var(--secondary)' }}>First Name</label>
              <input 
                type="text" 
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                style={{
                  width: '100%', padding: '10px', borderRadius: '8px', 
                  border: '1px solid var(--border)', background: 'var(--background)',
                  color: 'var(--foreground)', fontSize: '1rem'
                }}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', color: 'var(--secondary)' }}>Last Name</label>
              <input 
                type="text" 
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                style={{
                  width: '100%', padding: '10px', borderRadius: '8px', 
                  border: '1px solid var(--border)', background: 'var(--background)',
                  color: 'var(--foreground)', fontSize: '1rem'
                }}
                required
              />
            </div>
          </div>

          <div>
             <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', color: 'var(--secondary)' }}>Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{
                  width: '100%', padding: '10px', borderRadius: '8px', 
                  border: '1px solid var(--border)', background: 'var(--background)',
                  color: 'var(--foreground)', fontSize: '1rem', opacity: 0.7
                }}
                disabled
              />
              <div style={{fontSize: '0.75rem', color: 'var(--secondary)', marginTop: '4px'}}>Email cannot be changed directly.</div>
          </div>

           <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', color: 'var(--secondary)' }}>Bio</label>
              <textarea 
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                rows={4}
                style={{
                  width: '100%', padding: '10px', borderRadius: '8px', 
                  border: '1px solid var(--border)', background: 'var(--background)',
                  color: 'var(--foreground)', fontSize: '1rem', resize: 'vertical'
                }}
                placeholder="Tell us a bit about yourself..."
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                marginTop: '16px',
                padding: '12px', borderRadius: '8px', border: 'none',
                background: 'var(--primary)', color: 'white', fontWeight: '600',
                fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
        </form>
      </div>
    </div>
  );
}
