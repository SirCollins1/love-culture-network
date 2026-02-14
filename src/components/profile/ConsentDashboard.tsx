import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { 
  Shield, 
  MessageSquare, 
  Eye, 
  Ban,
  Save,
  Loader2,
  Lock,
  UserCheck
} from 'lucide-react';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';

interface PrivacySettings {
  allow_dms: boolean;
  allow_connection_requests: boolean;
  visibility: string;
  anti_spam_limit: number;
  visibility_roles: string[];
}

export const ConsentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<PrivacySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchSettings();
    }
  }, [user?.id]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('privacy_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings({
          ...data,
          visibility_roles: data.visibility_roles || ['Single', 'Intentional Partners', 'Married/Love Models']
        });
      } else {
        setSettings({
          allow_dms: false,
          allow_connection_requests: true,
          visibility: 'public',
          anti_spam_limit: 5,
          visibility_roles: ['Single', 'Intentional Partners', 'Married/Love Models']
        });
      }
    } catch (error: any) {
      toast.error('Failed to load privacy settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id || !settings) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('privacy_settings')
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Privacy settings updated successfully');
    } catch (error: any) {
      toast.error('Failed to update settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleRole = (role: string) => {
    if (!settings) return;
    const currentRoles = settings.visibility_roles || [];
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role];
    setSettings({ ...settings, visibility_roles: newRoles });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] border border-amber-100 shadow-sm">
        <div>
          <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Shield className="h-6 w-6 text-amber-600" />
            Consent & Privacy
          </h3>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Granular control over your interactions and community footprint.
          </p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-amber-600 hover:bg-amber-700 text-white rounded-2xl px-8 h-12 font-black uppercase tracking-widest shadow-lg shadow-amber-900/10"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Preferences
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="rounded-[2.5rem] border-amber-100 shadow-xl overflow-hidden border-none">
          <CardHeader className="bg-amber-50/50 p-8">
            <CardTitle className="text-xl font-black flex items-center gap-2 text-gray-900">
              <MessageSquare className="h-6 w-6 text-amber-600" />
              Communication Channels
            </CardTitle>
            <CardDescription className="font-medium">Decide who can start a conversation with you.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8 bg-white">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-3xl">
              <div className="space-y-1">
                <Label className="text-sm font-black text-gray-900 uppercase tracking-tight">Direct Messaging</Label>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">Unlock chat after mutual consent</p>
              </div>
              <Switch 
                checked={settings.allow_dms}
                onCheckedChange={(checked) => setSettings({ ...settings, allow_dms: checked })}
                className="data-[state=checked]:bg-amber-600"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-3xl">
              <div className="space-y-1">
                <Label className="text-sm font-black text-gray-900 uppercase tracking-tight">Connection Requests</Label>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">Allow purpose-tagged introductions</p>
              </div>
              <Switch 
                checked={settings.allow_connection_requests}
                onCheckedChange={(checked) => setSettings({ ...settings, allow_connection_requests: checked })}
                className="data-[state=checked]:bg-amber-600"
              />
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                  <Ban className="h-4 w-4 text-amber-600" />
                  Daily Interaction Cap
                </Label>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-black">{settings.anti_spam_limit} Requests</span>
              </div>
              <Slider 
                value={[settings.anti_spam_limit]}
                min={1}
                max={20}
                step={1}
                onValueChange={([val]) => setSettings({ ...settings, anti_spam_limit: val })}
                className="py-2"
              />
              <div className="flex justify-between text-[9px] font-black text-gray-300 uppercase tracking-widest">
                <span>Minimal</span>
                <span>Open</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-amber-100 shadow-xl overflow-hidden border-none">
          <CardHeader className="bg-amber-50/50 p-8">
            <CardTitle className="text-xl font-black flex items-center gap-2 text-gray-900">
              <Eye className="h-6 w-6 text-amber-600" />
              Role-Based Visibility
            </CardTitle>
            <CardDescription className="font-medium">Select roles permitted to discover your profile.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6 bg-white">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">Permitted Discovery Roles:</p>
            
            <div className="grid gap-4">
              {['Single', 'Intentional Partners', 'Married/Love Models'].map((role) => (
                <div 
                  key={role} 
                  className={`flex items-center justify-between p-4 rounded-3xl border transition-all cursor-pointer ${
                    settings.visibility_roles.includes(role) 
                    ? 'bg-amber-50 border-amber-200 shadow-sm' 
                    : 'bg-white border-gray-100 grayscale opacity-50'
                  }`}
                  onClick={() => toggleRole(role)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      settings.visibility_roles.includes(role) ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <Label 
                      htmlFor={`role-${role}`}
                      className="text-sm font-black text-gray-900 uppercase tracking-tight cursor-pointer"
                    >
                      {role}
                    </Label>
                  </div>
                  <Checkbox 
                    id={`role-${role}`} 
                    checked={settings.visibility_roles.includes(role)}
                    onCheckedChange={() => toggleRole(role)}
                    className="h-5 w-5 rounded-lg border-amber-200 data-[state=checked]:bg-amber-600"
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] flex gap-4">
              <Lock className="h-6 w-6 text-amber-500 shrink-0" />
              <p className="text-[10px] text-gray-300 font-medium leading-relaxed uppercase tracking-wider">
                Note: Integrity Badges and verified identity are immutable community standards and remain visible to all members for security purposes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};