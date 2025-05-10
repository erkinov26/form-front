import { useEffect, useState } from 'react';
import people from '@/public/people.png';
import logo from '@/public/logo.svg';
import { Button } from '@/components/ui/button';
import bgImage from '@/public/bg-reg.png'
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

type EducationType = 'Bakalavr kunduzgi' | 'Magistratura';

// type DirectionItem = {
//   name: string;
// } & {
//   [key in EducationType]: boolean;
// };

export default function Registration() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998');
  const [region, setRegion] = useState('');
  const [educationType, setEducationType] = useState<EducationType | ''>('');
  const [direction, setDirection] = useState('');
  const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<string | null>("");
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);

  // Ekran o'lchamini tekshirish va o'zgarishlarga javob berish
  useEffect(() => {
    const handleResize = () => {
      // 640px dan katta bo'lsa tasvirni ko'rsatadi
      setIsLargeScreen(window.innerWidth >= 640);
    };

    handleResize(); // Initial check qilish

    // Ekran o'lchami o'zgarganda tekshirish
    window.addEventListener('resize', handleResize);

    // Component unmount bo'lganda tozalash
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  interface ErrorResponse {
    response: {
      data: {
        error: string;
      };
    };
  }
  const { isPending, mutate, isSuccess } = useMutation({
    mutationFn: async (data: { ism: string; telefon: string }) => {
      const res = await axios.post("https://form-api.nordicuniversity.org/registratedusers", data);
      return res.data;
    },
    onSuccess: () => {
      setFullName('')
      setPhone('+998')
      setRegion("")
      setEducationType("")
      setDirection('')
      setErrors("")
    },
    onError: (error: ErrorResponse) => {
      console.log(error);
      setErrors(error.response?.data.error);
    },
  });
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    if (!input.startsWith('+998')) {
      input = '+998';
    }
    const digitsOnly = input.replace(/\D/g, '').slice(3, 12);
    setPhone('+998' + digitsOnly);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) newErrors.fullName = 'Ism majburiy';
    if (phone.length < 13) newErrors.phone = 'Toʻliq telefon raqam kiriting';
    if (!region) newErrors.region = 'Viloyatni tanlang';
    if (!educationType) newErrors.educationType = "Ta'lim shaklini tanlang";
    if (!direction) newErrors.direction = "Yo'nalishni tanlang";

    if (Object.keys(newErrors).length > 0) {
      setLocalErrors(newErrors);
      return;
    }

    const formData = {
      ism: fullName,
      telefon: phone,
      viloyat: region,
      talim_shakli: educationType,
      talim_yonalishi: direction,
    };
    console.log('Yuborilgan maʼlumot:', formData);
    mutate(formData)
  };

  const regions = [
    'Toshkent shahri', 'Toshkent viloyati', 'Andijon', 'Fargʻona', 'Namangan',
    'Samarqand', 'Buxoro', 'Xorazm', 'Qashqadaryo', 'Surxondaryo',
    'Jizzax', 'Sirdaryo', 'Navoiy', 'Qoraqalpogʻiston Respublikasi',
  ];

  const data: Record<EducationType, string[]> = {
    'Bakalavr kunduzgi': [
      'Jahon iqtisodiyoti va xalqaro iqtisodiy munosabatlar',
      'Tarix', 'Xorijiy til va adabiyoti', 'Boshlang‘ich ta‘lim',
      'Maktabgacha ta‘lim', 'Psixologiya', 'Maxsus pedagogika',
      'Iqtisodiyot', 'Moliya va moliyaviy texnologiyalar',
      'Biznesni boshqarish', 'Sanoat muhandisligi va menejmenti',
      'Kompyuter injiniringi', "Musiqa ta'limi", 'Turizm va mehmondo’stlik',
      'Jurnalistika', 'Amaliy matematika'
    ],
    'Magistratura': [
      'Pedagogika', 'Xorijiy til va adabiyoti', "Musiqa ta'limi va san'at",
      "Ta'lim muassasalari boshqaruvi", "Jurnalistika",
      "Ta'lim va tarbiya nazariyasi va metodikasi(boshlang'ich ta'lim)",
      "Ta'lim va tarbiya nazariyasi va metodikasi(Maktabgacha ta'lim)",
      "Jahon iqtisodiyoti", "Iqtisodiyot (tarmoqlar va sohalar bo'yicha)",
      "Ma'lumot ilmi (DATA SCIENCE)", "Turizm va mehmondo'stlik",
      "Amaliy matematika", "Kompyuter injiniringi"
    ]
  };

  const educationTypes: EducationType[] = ['Bakalavr kunduzgi', 'Magistratura'];

  return (
    <div className={`relative sm:flex w-full min-h-screen bg-center bg-none bg-cover`} style={{
      backgroundImage: isLargeScreen ? `url(${bgImage})` : 'none',
    }}>
      <div className="sm:w-1/2 px-[6vw] w-full h-screen bg-white py-[2vw]">
        <div>

          {isSuccess ? <div className='flex items-center flex-col min-h-[80vh] justify-center'>           <img src={logo} alt="univer-logo" className="sm:w-[10vw] sm:mt-[1vw]" /><p className="font-bebas sm:text-[4vw] text-center text-[8vw]  mt-[2vw] leading-[120%] sm:w-[75%]">
            <strong className="text-[#0B4075]">Tabriklaymiz</strong> {"talaba bo'lish uchun arizani to'ldirdingiz"}
          </p></div> : (<>               <img src={logo} alt="univer-logo" className="sm:w-[10vw]" />     <p className="font-bebas sm:text-[1.5vw] text-[8vw]  mt-[1vw] leading-[120%] sm:w-[75%]">
            <strong className="text-[#0B4075]">Nordik universitetida</strong> {"talaba bo'lish uchun pastdagi formani to'ldiring"}
          </p>

            <div className="flex flex-col sm:gap-[1vw] gap-[3vw] mt-[2vw]">
              <div className="flex flex-col gap-[0.5vw]">
                <label className="sm:text-[1vw] text-[4vw]" >Ism</label>
                <input
                  placeholder="Ismingizni kiriting"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full sm:h-[3vw] h-[10vw] sm:text-[1vw] text-[4vw] sm:px-[1vw] px-[4vw] border border-gray-300 rounded-sm"
                />
                {localErrors.fullName && <span className="text-red-500 sm:text-[1vw]">{localErrors.fullName}</span>}
              </div>
              <div className="flex flex-col gap-[0.5vw]">
                <label className="sm:text-[1vw] text-[4vw]" >Telefoningizni kiriting</label>
                <input
                  value={phone}
                  onChange={handlePhoneChange}
                  inputMode="numeric"
                  maxLength={13}
                  className="w-full sm:h-[3vw] h-[10vw] sm:text-[1vw] text-[4vw] sm:px-[1vw] px-[4vw] border border-gray-300 rounded-sm"
                />
                {localErrors.phone && <span className="text-red-500 sm:text-[1vw]">{localErrors.phone}</span>}
              </div>
              <div className="flex flex-col gap-[0.5vw]">
                <label className="sm:text-[1vw] text-[4vw]">Qaysi viloyatdansiz</label>
                <select
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full sm:h-[3vw] h-[10vw] sm:text-[1vw] text-[4vw] sm:px-[1vw] px-[4vw] border border-gray-300 rounded-sm"
                >
                  <option value="">Viloyatni tanlang</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                {localErrors.region && <span className="text-red-500 sm:text-[1vw]">{localErrors.region}</span>}
              </div>
              <div className="flex flex-col gap-[0.5vw]">
                <label className="sm:text-[1vw] text-[4vw]">{"Ta'lim"} shakli</label>
                <select
                  onChange={(e) => { setEducationType(e.target.value as EducationType); setDirection(''); }}
                  className="w-full sm:h-[3vw] h-[10vw] sm:text-[1vw] text-[4vw] sm:px-[1vw] px-[4vw] border border-gray-300 rounded-sm"
                >
                  <option value="">{"Ta'lim"} turini tanlang</option>
                  {educationTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {localErrors.educationType && <span className="text-red-500 sm:text-[1vw]">{localErrors.educationType}</span>}
              </div>
              <div className="flex flex-col gap-[0.5vw]">
                <label className="sm:text-[1vw] text-[4vw]">Yo'nalishni tanlang</label>
                <select
                  onChange={(e) => setDirection(e.target.value)}
                  value={direction}
                  className="w-full sm:h-[3vw] h-[10vw] sm:text-[1vw] text-[4vw] sm:px-[1vw] px-[4vw] border border-gray-300 rounded-sm"
                  disabled={!educationType}
                >
                  <option value="">Yo'nalishni tanlang</option>
                  {educationType &&
                    data[educationType]?.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
                {localErrors.direction && <span className="text-red-500 sm:text-[1vw]">{localErrors.direction}</span>}
              </div>


              {errors && <p className='text-center text-red-400 text-0.5vw'>{errors}</p>}

              <Button
                className="mt-[2vw] bg-[#0B4075] sm:text-[1vw] text-[4vw] text-white sm:h-[3vw] h-[10vw] px-[5vw]"
                onClick={handleSubmit}
              >
                {
                  isPending ? "Yuborilyapti" : "Yuborish"
                }
              </Button>
            </div></>)}
        </div>
      </div>

      <div className="sm:w-1/2 h-screen hidden sm:flex items-end">
        <img src={people} alt="students" className="w-full object-cover" />
      </div>

    </div>
  );
}
