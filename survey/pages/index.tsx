import Head from 'next/head';
import dynamic from 'next/dynamic';

const SurveyWizard = dynamic(() => import('../components/SurveyWizard'), { ssr: false });

export default function Home() {
  return (
    <>
      <Head>
        <title>AI Confidence Pulse</title>
        <meta name="description" content="Interactive employee AI sentiment survey" />
      </Head>
      <SurveyWizard />
    </>
  );
}
