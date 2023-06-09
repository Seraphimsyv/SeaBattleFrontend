import {
  useState,
  useEffect
} from 'react';
import {
  GridColDef,
} from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import TableComponent from "../../components/TableComponent";
import LoaderComponent from '../../components/LoaderComponent';
import AccountService from '../../service/account-service';

const cols: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
  },
  {
    field: 'steps',
    headerName: 'Steps',
    sortable: true,
  },
  {
    field: 'winnerStatus',
    headerName: 'Winner',
    sortable: true,
    renderCell: (params) => {
      switch (params.value) {
        case 1:
          return <DoneOutlineIcon color='success' />
        case 0:
          return <DoDisturbIcon color='error' />
      }
    }
  },
  {
    field: 'winnerPoints',
    headerName: 'Winner Points',
    sortable: true,
  },
  {
    field: 'loserPoints',
    headerName: 'Loser Points',
    sortable: true,
  },
  {
    field: 'createdAt',
    headerName: 'Created',
    sortable: true,
    flex: 3
  },
  {
    field: 'finishAt',
    headerName: 'Finished',
    sortable: true,
    flex: 3
  }
];

type Statistic = {
  points: number,
  games: {
    total: number,
    wone: number,
    lose: number,
  }
}

type History = {
  createdAt: Date,
  finishAt: Date,
  id: number,
  steps: number,
  loserPoints: number,
  winnerPoints: number,
  winnerStatus: 0 | 1,
}

const StatisticPage = () => {
  const [statistic, setStatistic] = useState<Statistic | undefined>(undefined);
  const [history, setHistory] = useState<History[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    const token = window.localStorage.getItem('token');

    if (!token) return;

    AccountService.loadStatistic(token)
    .then((statistic: Statistic) => {
      AccountService.loadHistory(token)
      .then((history: History[]) => {
        setStatistic(statistic);
        setHistory(history);
        setLoaded(true);
      });
    });
  })

  return (
    <>
      {statistic && (
        <Box
          sx={{
            height: '10%',
            margin: 'auto',
            padding: '1em',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Stack direction='row' spacing={3}>
            <Chip
              label={`Total points: ${statistic.points}`}
            />
            <Chip
              label={`Total games: ${statistic.games.total}`}
            />
            <Chip
              label={`Wone games: ${statistic.games.wone}`}
            />
            <Chip
              label={`Lose games: ${statistic.games.lose}`}
            />
          </Stack>
        </Box>
      )}
      {loaded ? (
        <>
          <TableComponent
            rows={history}
            columns={cols}
            pageSize={10}
          />
        </>
      ) : (
        <>
          <LoaderComponent active>
            Loading
          </LoaderComponent>
        </>
      )}
    </>
  )
}

export default StatisticPage;