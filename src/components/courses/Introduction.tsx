'use client'

import React from 'react';
import Callout from '../Callout';

export default function Introduction() {
  return (
    <div className='px-3 md:px-6 md:max-w-2xl'>
      <div className='py-6 flex flex-col gap-2'>
        <h3 className='text-xl font-bold'>舞蹈風格介紹</h3>
        <p>Baila&apos;more 提供多種拉丁舞蹈課程，每種舞蹈都有其獨特的風格和魅力。選擇適合您的舞蹈風格，開始您的拉丁舞之旅。</p>
      </div>
      <div className='flex flex-col gap-3 py-3'>
        <h3 className='text-2xl font-bold'>Bachata</h3>
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe 
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/AE5NriBseoY?si=5u75-CtAGmvwPtVn" 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
          ></iframe>
        </div>
        <p className='text-sm'>
          Bachata 起源於多明尼加共和國，是一種感性且富有情感的舞蹈。以四拍節奏和臀部的細微擺動為特色，動作流暢且優雅。Bachata 音樂通常帶有浪漫或憂傷的情感，舞蹈風格強調親密的舞伴連接和身體的波浪動作。
        </p>
        <div className='flex gap-1 items-center'>
          <img src='/icons/info.svg' alt='info' className='w-4 h-4' />
          <p className='text-sm'>
            課程級別
          </p>
        </div>
        <Callout title='Lv1' description='學習基本步伐、身體隔離和簡單的舞伴帶領技巧，適合初學者。' />
        <Callout title='Lv2' description='進階身體波浪、複雜的舞伴連接和花式動作，適合已有 Bachata 基礎的學員。' />
        <Callout title='中階' description='高級技巧、音樂詮釋和即興創作，適合已熟練掌握 Lv2 內容的學員。' />
      </div>
      <div className='flex flex-col gap-3 py-3'>
        <h3 className='text-2xl font-bold'>Salsa</h3>
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe 
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/dVxiFav_Z58?si=ZA16L7qQWs4NUUls" 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
          ></iframe>
        </div>
        <p className='text-sm'>
        Salsa 是一種充滿活力的拉丁舞蹈，源自古巴和波多黎各。以快節奏的音樂和熱情的舞步聞名，強調節奏感和身體的擺動。Salsa 舞步基於八拍節奏，包含多種旋轉和花式動作，是最受歡迎的社交舞蹈之一。
        </p>
        <div className='flex gap-1 items-center'>
          <img src='/icons/info.svg' alt='info' className='w-4 h-4' />
          <p className='text-sm'>
            課程級別
          </p>
        </div>
        <Callout title='Lv1' description='學習基本步伐、舞伴基礎握位與基本轉圈技巧，建立穩固的身體節奏感與律動基礎，適合 Salsa 初學者。' />
        <Callout title='Lv2' description='進階雙人搭配技巧、身體協調與節奏變化，並加入獨舞 Shine 元素，適合已具備 Salsa 基礎、希望提升表現力與舞感的學員。' />
      </div>
    </div>
  );
}