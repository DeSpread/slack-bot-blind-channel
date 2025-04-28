exports.getEmoji = (name) => {
  const [, lastName] = name.split(' ');

  switch (lastName) {
    case '토끼':
      return ':rabbit:';
    case '오리':
      return ':duck:';
    case '양':
      return ':sheep:';
    case '사자':
      return ':lion_face:';
    case '코끼리':
      return ':elephant:';
    case '사슴':
      return ':deer:';
    case '호랑이':
      return ':tiger:';
    case '거미':
      return ':spider:';
    case '여우':
      return ':fox_face:';
    case '강아지':
      return ':dog:';
    case '원숭이':
      return ':monkey:';
    case '쥐':
      return ':mouse:';
    case '소':
      return ':cow:';
    case '뱀':
      return ':snake:';
    case '말':
      return ':horse:';
    case '상어':
      return ':shark:';
    case '돼지':
      return ':pig:';
    case '늑대':
      return ':wolf:';
    case '코뿔소':
      return ':rhinoceros:';
    case '라쿤':
      return ':raccoon:';
    case '유니콘':
      return ':unicorn_face:';
    case '나비':
      return ':butterfly:';
    case '햄스터':
      return ':hamster:';
    case '오징어':
      return ':squid:';
    case '고등어':
      return ':fish:';
    case '참새':
      return ':bird:';
    case '독수리':
      return ':eagle:';
    case '도마뱀':
      return ':lizard:';
    case '앵무새':
      return ':parrot:';
    case '개구리':
      return ':frog:';
    case '버섯':
      return ':mushroom:';
    case '문어':
      return ':octopus:';
    case '거북이':
      return ':turtle:';
    case '돌고래':
      return ':dolphin:';
    case '네잎클로버':
      return ':four_leaf_clover:';
    case '악어':
      return ':crocodile:';
    case '곰':
      return ':bear:';
    case '고양이':
      return ':cat:';
    case '닭':
      return ':chicken:';
    case '개미':
      return ':ant:';
    case '공룡':
      return ':sauropod:';
    case '나무늘보':
      return ':sloth:';
    case '고슴도치':
      return ':hedgehog:';
    case '하마':
      return ':hippopotamus:';
    case '드래곤':
      return ':dragon:';
    case '박쥐':
      return ':bat:';
    case '오랑우탄':
      return ':orangutan:';
    case '낙타':
      return ':camel:';
    case '병아리':
      return ':baby_chick:';
    case '비둘기':
      return ':dove_of_peace:';
    case '꿀벌':
      return ':bee:';
    case '표범':
      return ':leopard:';
    case '코알라':
      return ':koala:';
    case '캥거루':
      return ':kangaroo:';
    case '펭귄':
      return ':penguin:';
    case '스컹크':
      return ':skunk:';
    case '달팽이':
      return ':snail:';
    case '해바라기':
      return ':sunflower:';
    case '지렁이':
      return ':worm:';
    default:
      return ':ghost:';
  }
};

exports.formattedMessage = ({ name, message }) => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const kr = new Date(utc + 9 * 60 * 60 * 1000);

  const formattedDate = kr.toLocaleDateString('ko-KR');
  const formattedTime = kr.toLocaleTimeString('ko-KR');

  return `> ${getEmoji(
    name,
  )} *${name}* 님이 *${formattedDate} ${formattedTime}* 에 등록한 메시지입니다.\n\n${message}`;
};
