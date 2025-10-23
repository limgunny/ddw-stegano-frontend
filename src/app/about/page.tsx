import Link from 'next/link'
import {
  ShieldCheckIcon,
  FingerPrintIcon,
  SparklesIcon,
  CursorArrowRaysIcon,
} from '@heroicons/react/24/outline'

const features = [
  {
    name: '강력한 암호화 보안',
    description:
      '모든 워터마크 정보는 서버의 비밀 키로 암호화됩니다. 데이터가 유출되어도 저희 서버가 아니면 절대 해독할 수 없습니다.',
    icon: ShieldCheckIcon,
  },
  {
    name: '정확한 유출자 추적',
    description:
      '영상마다 고유한 사용자 정보가 삽입되어, 유출 발생 시 어떤 사용자의 영상인지 100% 정확하게 식별할 수 있습니다.',
    icon: FingerPrintIcon,
  },
  {
    name: '원본 화질 보존',
    description:
      '무손실 압축 코덱(Lossless Codec)을 사용하여 워터마크를 삽입하므로, 원본 영상의 화질 저하가 전혀 없습니다.',
    icon: SparklesIcon,
  },
  {
    name: '간편한 사용법',
    description:
      '복잡한 과정 없이 영상을 업로드하기만 하면, 모든 워터마킹 과정이 자동으로 처리되는 직관적인 시스템을 제공합니다.',
    icon: CursorArrowRaysIcon,
  },
]

const steps = [
  {
    id: '01',
    name: '영상 업로드',
    description:
      '보호하고 싶은 원본 영상을 업로드합니다. 회원가입 후 누구나 쉽게 이용할 수 있습니다.',
  },
  {
    id: '02',
    name: '자동 워터마킹',
    description:
      '시스템이 자동으로 당신의 고유 정보를 암호화하여 비가시성 워터마크로 영상에 삽입합니다.',
  },
  {
    id: '03',
    name: '유출자 추적',
    description:
      "외부에 유출된 영상을 발견하면, 'Decrypt' 페이지에 업로드하여 누가 유출했는지 즉시 확인하세요.",
  },
]

export default function AboutPage() {
  return (
    <div className="bg-gray-900 text-gray-100">
      <div className="text-center p-8 sm:p-12 bg-gray-800/50 rounded-xl m-4 sm:m-6 lg:m-8 border border-gray-700">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-400">
          Dynamic Digital Watermarking
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-gray-300">
          당신의 소중한 영상 콘텐츠를 보호하세요. 육안으로 식별 불가능한
          워터마크로 유출자를 정확히 추적하고, 콘텐츠의 가치를 지킵니다.
        </p>
        <div className="mt-8">
          <Link
            href="/encrypt"
            className="inline-block bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            지금 영상 업로드
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 sm:py-16">
        {/* Features Section */}
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-purple-600">
            왜 DDW를 사용해야 할까요?
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            단순한 워터마크를 넘어, 콘텐츠 보안을 위한 완벽한 솔루션을
            제공합니다.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600">
                    <feature.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-400">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* How it works Section */}
        <div className="mt-24 sm:mt-32">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-purple-400">
              어떻게 작동하나요?
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              단 3단계로 당신의 콘텐츠를 안전하게 보호하세요.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="flex flex-col items-start p-6 bg-gray-800 rounded-xl border border-gray-700"
                >
                  <div className="text-4xl font-bold text-purple-600">
                    {step.id}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {step.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 sm:mt-32 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            지금 바로 당신의 콘텐츠를 보호하세요
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-400">
            더 이상 콘텐츠 불법 유출로 고민하지 마세요. DDW가 가장 확실한
            해결책을 제공합니다.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/encrypt"
              className="rounded-md bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
