import {Flex, Heading, Select, Text} from "@chakra-ui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import {useEffect, useState} from "react";
import {Bar} from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Tooltip,
  Legend,
  Title,
)

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: 'top',
    },
    title: {
      display: false,
      text: 'Users Activity',
    }
  },
}
export default function Analytics() {

  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    setData([65, 59, 80, 81, 56, 55, 40])
  }

  return (
    <Flex direction='column' pt={{base: "120px", md: "75px"}}>
      <Heading>Analytics</Heading>
      <Flex direction={'column'}
            p={4} gap={4}
      >
        <Flex
          justifyContent={'space-between'} h={12}
          alignItems={'center'}
        >
          <Text color={'gray.400'}>Activity Users</Text>
          <Select w={40}>
            <option value="month">Month</option>
          </Select>
        </Flex>
        <Flex
          justifyContent={'center'}
        >
          <Flex
            w={{
              base: '100%',
              md: '60%'
            }}
          >
            <Bar
              options={options}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                  data: data,
                  label: 'Users',
                  backgroundColor: '#747783',
                }],
              }}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
