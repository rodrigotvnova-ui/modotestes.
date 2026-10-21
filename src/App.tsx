import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { usePWA } from './utils/pwaInstall';
import { Header } from './components/common/Header';
import { BottomNav, NavTab } from './components/common/BottomNav';
import { SplashScreen } from './components/common/SplashScreen';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { TodayScreen } from './components/screens/TodayScreen';
import { JourneyScreen } from './components/screens/JourneyScreen';
import { HabitsScreen } from './components/screens/HabitsScreen';
import { ToolsScreen, ToolSubTab } from './components/screens/ToolsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { WifiOff, Smartphone, ShieldCheck, Battery, Wifi, Signal } from 'lucide-react';

function AppContent() {
  const { profile } = useApp();
  const { isOnline, isOfflineReady } = usePWA();
  const [showSplash, setShowSplash] = useState(true);
  const [currentTab, setCurrentTab] = useState<NavTab>('today');
  const [isSimulatorMode, setIsSimulatorMode] = useState(false);

  // Cross-screen navigation states
  const [selectedJourneyDay, setSelectedJourneyDay] = useState<number | undefined>(undefined);
  const [toolsSubTab, setToolsSubTab] = useState<ToolSubTab>('two_minute');
  const [focusTask, setFocusTask] = useState<string>('');
  const [focusMinutes, setFocusMinutes] = useState<number>(25);

  const handleOpenLesson = (day: number) => {
    setSelectedJourneyDay(day);
    setCurrentTab('journey');
  };

  const handleOpenTwoMinute = () => {
    setToolsSubTab('two_minute');
    setCurrentTab('tools');
  };

  const handleOpenFocus = (mins = 25) => {
    setFocusMinutes(mins);
    setToolsSubTab('focus');
    setCurrentTab('tools');
  };

  const handleNavigateToTool = (toolId: string) => {
    if (toolId === 'two_minute') setToolsSubTab('two_minute');
    else if (toolId === 'focus') setToolsSubTab('focus');
    else if (toolId === 'detox') setToolsSubTab('detox');
    else if (toolId === 'habit_loop') setToolsSubTab('habit_loop');
    else if (toolId === 'finances') setToolsSubTab('finances');
    else if (toolId === 'goals') setToolsSubTab('goals');
    else if (toolId === 'diagnostic') setToolsSubTab('diagnostic');
    else if (toolId === 'library') setToolsSubTab('library');
    else if (toolId === 'habits') {
      setCurrentTab('habits');
      return;
    } else if (toolId === 'today') {
      setCurrentTab('today');
      return;
    }
    setCurrentTab('tools');
  };

  const handleOpenDiagnosticFromOnboarding = () => {
    setToolsSubTab('diagnostic');
    setCurrentTab('tools');
  };

  return (
    <div className="min-h-screen bg-[#090E1A] text-[#F5F7FC] flex flex-col items-center">
      {/* Opening Splash Screen */}
      {showSplash && (
        <SplashScreen
          onDismiss={() => setShowSplash(false)}
          isOfflineReady={isOfflineReady}
        />
      )}

      {/* Offline Connectivity Toast (Visible when connection drops) */}
      {!isOnline && (
        <aside
          aria-live="polite"
          className="fixed top-16 z-40 px-3.5 py-1.5 rounded-full bg-amber-500/95 text-black text-xs font-bold shadow-xl flex items-center gap-2 animate-pulse"
        >
          <WifiOff className="w-3.5 h-3.5" />
          <span>Modo Offline Ativo • Registros preservados no aparelho</span>
        </aside>
      )}

      {/* Onboarding Flow (Shown if not yet completed) */}
      <OnboardingModal onOpenDiagnostic={handleOpenDiagnosticFromOnboarding} />

      {/* Global Header */}
      <Header
        currentTab={currentTab}
        isSimulatorMode={isSimulatorMode}
        onToggleSimulator={() => setIsSimulatorMode(!isSimulatorMode)}
      />

      {/* Container: Either Smartphone Frame or Expanded Adaptive Layout */}
      <main className="w-full flex-1 flex justify-center p-0 sm:p-4">
        {isSimulatorMode ? (
          /* Phone Frame Container */
          <div className="w-full max-w-[430px] my-2 bg-[#141D30] border-[10px] border-[#1D2940] rounded-[48px] shadow-2xl overflow-hidden flex flex-col relative min-h-[840px] max-h-[920px]">
            {/* Phone Notch & Status Bar */}
            <div className="bg-[#090E1A] px-6 py-2.5 flex items-center justify-between text-[11px] font-mono text-[#B4BFD2] border-b border-[#222F4A] shrink-0 select-none">
              <span>09:41</span>
              <div className="w-24 h-4 bg-[#141D30] rounded-full mx-auto" />
              <div className="flex items-center gap-1.5 text-[#F5F7FC]">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5 text-[#65D6A4]" />
              </div>
            </div>

            {/* Scrollable App View Inside Frame */}
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-20 relative">
              {currentTab === 'today' && (
                <TodayScreen
                  onOpenLesson={handleOpenLesson}
                  onOpenTwoMinute={handleOpenTwoMinute}
                  onOpenFocus={handleOpenFocus}
                />
              )}
              {currentTab === 'journey' && (
                <JourneyScreen
                  selectedDay={selectedJourneyDay}
                  onSelectDay={(day) => setSelectedJourneyDay(day)}
                  onNavigateToTool={handleNavigateToTool}
                />
              )}
              {currentTab === 'habits' && <HabitsScreen />}
              {currentTab === 'tools' && (
                <ToolsScreen
                  initialSubTab={toolsSubTab}
                  initialFocusTask={focusTask}
                  initialFocusMinutes={focusMinutes}
                />
              )}
              {currentTab === 'profile' && <ProfileScreen />}
            </div>

            {/* Fixed Bottom Nav Inside Simulator */}
            <div className="absolute bottom-0 left-0 right-0">
              <BottomNav currentTab={currentTab} onSelectTab={setCurrentTab} />
            </div>
          </div>
        ) : (
          /* Adaptive Full View (Desktop & Tablet & Real Mobile) */
          <div className="w-full max-w-4xl px-3 sm:px-6 pt-4 pb-16">
            {currentTab === 'today' && (
              <TodayScreen
                onOpenLesson={handleOpenLesson}
                onOpenTwoMinute={handleOpenTwoMinute}
                onOpenFocus={handleOpenFocus}
              />
            )}
            {currentTab === 'journey' && (
              <JourneyScreen
                selectedDay={selectedJourneyDay}
                onSelectDay={(day) => setSelectedJourneyDay(day)}
                onNavigateToTool={handleNavigateToTool}
              />
            )}
            {currentTab === 'habits' && <HabitsScreen />}
            {currentTab === 'tools' && (
              <ToolsScreen
                initialSubTab={toolsSubTab}
                initialFocusTask={focusTask}
                initialFocusMinutes={focusMinutes}
              />
            )}
            {currentTab === 'profile' && <ProfileScreen />}

            {/* Standard Bottom Nav */}
            <BottomNav currentTab={currentTab} onSelectTab={setCurrentTab} />
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
