import { Chat } from './chat'
import { FileExplorer } from './file-explorer'
import { Header } from './header'
import { Horizontal, Vertical } from '@/components/layout/panels'
import { Logs } from './logs'
import { Preview } from './preview'
import { TabContent, TabItem } from '@/components/tabs'
import { Welcome } from '@/components/modals/welcome'
import { cookies } from 'next/headers'
import { getHorizontal, getVertical } from '@/components/layout/sizing'
import { hideBanner } from '@/app/actions'
import { OnboardingTour } from '@/components/ui/tooltip'
import { useOnboarding } from '@/lib/onboarding'

interface InitialState {
  sandboxId?: string
  sandboxSession?: { sandboxId: string; createdAt: number }
}

export default async function Page() {
  const store = await cookies()
  const banner = store.get('banner-hidden')?.value !== 'true'
  const horizontalSizes = getHorizontal(store)
  const verticalSizes = getVertical(store)

  let initialSandboxId: string | undefined
  const sessionCookie = store.get('sandbox-session')?.value
  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie) as {
        sandboxId: string
        createdAt: number
      }
      const age = Date.now() - session.createdAt
      if (age < 24 * 60 * 60 * 1000) {
        initialSandboxId = session.sandboxId
      }
    } catch {
      // Invalid cookie, ignore
    }
  }

  return (
    <>
      <Welcome defaultOpen={banner} onDismissAction={hideBanner} />
      <OnboardingTourWrapper initialSandboxId={initialSandboxId} />
      <div className="flex flex-col h-screen max-h-screen overflow-hidden p-2 space-x-2">
        <Header className="flex items-center w-full" />
        <ul className="flex space-x-5 font-mono text-sm tracking-tight px-1 py-2 md:hidden">
          <TabItem tabId="chat">Chat</TabItem>
          <TabItem tabId="preview">Preview</TabItem>
          <TabItem tabId="file-explorer">File Explorer</TabItem>
          <TabItem tabId="logs">Logs</TabItem>
        </ul>

        {/* Mobile layout tabs taking the whole space*/}
        <div className="flex flex-1 w-full overflow-hidden pt-2 md:hidden">
          <TabContent tabId="chat" className="flex-1">
            <Chat
              className="flex-1 overflow-hidden"
              initialSandboxId={initialSandboxId}
            />
          </TabContent>
          <TabContent tabId="preview" className="flex-1">
            <Preview className="flex-1 overflow-hidden" />
          </TabContent>
          <TabContent tabId="file-explorer" className="flex-1">
            <FileExplorer className="flex-1 overflow-hidden" />
          </TabContent>
          <TabContent tabId="logs" className="flex-1">
            <Logs className="flex-1 overflow-hidden" />
          </TabContent>
        </div>

        {/* Desktop layout with horizontal and vertical panels */}
        <div className="hidden flex-1 w-full min-h-0 overflow-hidden pt-2 md:flex">
          <Horizontal
            defaultLayout={horizontalSizes ?? [50, 50]}
            left={
              <Chat
                className="flex-1 overflow-hidden"
                initialSandboxId={initialSandboxId}
              />
            }
            right={
              <Vertical
                defaultLayout={verticalSizes ?? [33.33, 33.33, 33.33]}
                top={<Preview className="flex-1 overflow-hidden" />}
                middle={<FileExplorer className="flex-1 overflow-hidden" />}
                bottom={<Logs className="flex-1 overflow-hidden" />}
              />
            }
          />
        </div>
      </div>
    </>
  )
}

function OnboardingTourWrapper({ initialSandboxId }: { initialSandboxId?: string }) {
  const { showOnboarding, completeOnboarding } = useOnboarding()

  const steps = [
    {
      target: 'chat',
      content: 'Chat with AI to generate code, run commands, and build applications.',
    },
    {
      target: 'preview',
      content: 'See live preview of your application running in the sandbox.',
    },
    {
      target: 'file-explorer',
      content: 'Browse and view files generated in the sandbox filesystem.',
    },
    {
      target: 'logs',
      content: 'Monitor command execution logs and errors here.',
    },
  ]

  if (!showOnboarding) return null

  return <OnboardingTour steps={steps} onComplete={completeOnboarding} />
}

