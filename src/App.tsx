import { AnimatePresence, motion } from 'framer-motion';
import { QUESTIONS } from './data/questions';
import { SEGMENTS } from './data/segments';
import { useQuizFlow } from './hooks/useQuizFlow';
import { ProgressBar } from './components/ProgressBar';
import { Brand } from './components/Brand';
import { IntroScreen } from './screens/IntroScreen';
import { QuestionScreen } from './screens/QuestionScreen';
import { ResultScreen } from './screens/ResultScreen';
import { LeadScreen } from './screens/LeadScreen';
import { ThanksScreen } from './screens/ThanksScreen';

export default function App() {
  const {
    step,
    direction,
    answers,
    segmentId,
    start,
    answer,
    backFromQuestion,
    toLead,
    backToResult,
    submitLead,
    restart,
  } = useQuizFlow();

  const currentQuestion =
    step.kind === 'question' ? QUESTIONS[step.index] : null;
  const showProgress = step.kind === 'question';

  return (
    <div className="app-viewport flex w-full items-stretch justify-center">
      <div className="relative flex w-full max-w-[440px] flex-col px-5">
        <header className="flex items-center pt-5">
          {showProgress && currentQuestion ? (
            <div className="w-full">
              <ProgressBar
                current={currentQuestion.index + 1}
                total={QUESTIONS.length}
                canGoBack
                onBack={backFromQuestion}
              />
            </div>
          ) : (
            <Brand />
          )}
        </header>

        <main className="relative mt-6 flex flex-1 flex-col pb-6">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            {step.kind === 'intro' && (
              <motion.div key="intro" className="flex flex-1">
                <IntroScreen onStart={start} />
              </motion.div>
            )}

            {step.kind === 'question' && currentQuestion && (
              <motion.div key={`q-${currentQuestion.id}`} className="flex flex-1">
                <QuestionScreen
                  question={currentQuestion}
                  value={answers[currentQuestion.id]}
                  direction={direction}
                  onSelect={(optionId) => answer(currentQuestion.id, optionId)}
                />
              </motion.div>
            )}

            {step.kind === 'result' && (
              <motion.div key="result" className="flex flex-1">
                <ResultScreen segment={SEGMENTS[segmentId]} onCTA={toLead} />
              </motion.div>
            )}

            {step.kind === 'lead' && (
              <motion.div key="lead" className="flex flex-1">
                <LeadScreen onBack={backToResult} onSubmit={submitLead} />
              </motion.div>
            )}

            {step.kind === 'thanks' && (
              <motion.div key="thanks" className="flex flex-1">
                <ThanksScreen onRestart={restart} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
