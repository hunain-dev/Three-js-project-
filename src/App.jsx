
import LocomotiveScroll from 'locomotive-scroll';
import Mainwork from './Assingment/Mainwork'
import Somework from './Assingment/Somework';

const App = () => {

  const locomotiveScroll = new LocomotiveScroll();

  return (
    <locomotiveScroll>
  <div className='w-full'>
      <Somework/>
    </div>
    </locomotiveScroll>
  
  )
}

export default App
