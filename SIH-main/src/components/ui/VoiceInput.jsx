'use client'
import { useState, useEffect, useCallback } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'

export function VoiceInput({ onResult, onStart, onEnd, disabled = false, className = '' }) {
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState(null)
  const [recognition, setRecognition] = useState(null)

  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const sr = new SpeechRecognition()
        sr.continuous = false
        sr.interimResults = false
        sr.lang = 'en-US'

        sr.onstart = () => {
          setIsListening(true)
          setError(null)
          onStart?.()
        }

        sr.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          onResult(transcript)
        }

        sr.onerror = (event) => {
          console.error('Speech recognition error', event.error)
          setError(event.error)
          setIsListening(false)
          onEnd?.()
        }

        sr.onend = () => {
          setIsListening(false)
          onEnd?.()
        }

        setRecognition(sr)
      } else {
        setError('not_supported')
      }
    }
  }, [onResult, onStart, onEnd])

  const toggleListening = useCallback(() => {
    if (!recognition) return

    if (isListening) {
      recognition.stop()
    } else {
      recognition.start()
    }
  }, [recognition, isListening])

  if (error === 'not_supported') {
    return (
      <button type="button" disabled className={`opacity-50 cursor-not-allowed ${className}`} title="Voice search not supported in this browser">
        <MicOff size={20} className="text-muted" />
      </button>
    )
  }

  return (
    <button
      type="button"
      disabled={disabled || !recognition}
      onClick={toggleListening}
      className={`relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all ${
        isListening 
          ? 'bg-coral-pale text-coral animate-pulse' 
          : 'bg-page-cool text-ink hover:bg-blue-pale hover:text-blue'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      title={isListening ? "Stop listening" : "Voice Search"}
    >
      {isListening ? (
        <span className="relative flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75"></span>
          <span className="relative inline-flex h-5 w-5 items-center justify-center"><Mic size={20} /></span>
        </span>
      ) : (
        <Mic size={20} />
      )}
    </button>
  )
}
