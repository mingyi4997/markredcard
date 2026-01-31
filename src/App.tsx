import { Header } from './components/Layout/Header'
import { MainLayout } from './components/Layout/MainLayout'
import { RichTextEditor } from './components/Editor/RichTextEditor'
import { CardPreview } from './components/Preview/CardPreview'

function App() {
  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <Header />
      <MainLayout
        leftPanel={<RichTextEditor />}
        rightPanel={<CardPreview />}
      />
    </div>
  )
}

export default App
