
import {Tooltip, Typography, Button} from "antd";

const {Text} = Typography

interface CampaignDisplayObj {
  campaign_id: number,
  start_date: string,
  end_date: string,
  video_link: string,
  price: number,
  plan_name: string
}


export const getCampaignsColumns = (
  handleCampaignDetailsClick: (id: number) => void,
  handleCampaignClick: (id: number) => void
) => {
  return ( [
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 120,
        align: 'center',
        onCell: () => {
          return { style: { textAlign: "center" } }; // Flexbox style to allow column to shrink or expand
        },
        render: (text: string) => {
          let toolTipMessage = "";
          let displayText = "";
          let color = "";

          switch(text.toLowerCase()) {
            case "active":
              toolTipMessage = "Your campaign is active. Click details to the right to view results, there may be a delay in these numbers.";
              displayText = text.charAt(0).toUpperCase() + text.slice(1);
              color = '#27ae60'; // Green
              break;
            case "setup":
              toolTipMessage = "Your campaign is waiting approval by YouTube. This usually takes a few hours.";
              displayText = "In-Setup";
              color = '#f39c12'; // Yellow
              break;
            case "stopped":
              toolTipMessage = "Your campaign is stopped. To restart it click edit and start.";
              displayText = "Stopped";
              color = "#e74c3c";
              break;
            default:
              toolTipMessage = "Unknown campaign status.";
              displayText = "Unknown";
              color = '#bdc3c7'; // Gray
              
              
          }
          return (
            <Tooltip title={toolTipMessage}>
              <Text
                style={{
                  color: color, 
                  fontWeight: 'bold', 
                  display: 'inline-block',
                  margin: 0,
                  cursor: "pointer"
                }}
              >
                {displayText}
              </Text> 
            </Tooltip>
          )
        }
      },
      {
        title: 'Plan Name',
        dataIndex: 'plan_name',
        key: 'plan_name',
        width: 105,
        render: (text: string) => (
          <Text>
            {text}
          </Text>
        ), 
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        width: 100,
        render: (text: string) => (
        <Text style={{maxWidth: "120px"}}>
          {`$${text}`}
        </Text>), // Format as currency
      },
      {
          title: 'Video Title',
          dataIndex: 'video_title',
          key: 'video_title',
          responsive:["sm"],
          ellipsis: true,
          width: 300,
          // onCell: () => {
          //   // return { style: { minWidth: '500px', flex: 1 } }; // Flexbox style to allow column to shrink or expand
          // },
          render: (text:string) => (
            // text
            <Tooltip title={text} style={{minWidth: "300px"}}>
                <Text style={{
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}>
                    {text}
                </Text>
            </Tooltip>
          ),
      },
      {
          title: 'Actions',
          key: 'actions',
          width: 200,
          onCell: () => {
            return { style: { textAlign: "center" } }; // Flexbox style to allow column to shrink or expand
          },
          render: (_: unknown, record: CampaignDisplayObj) => (
            <span>
              <Button onClick={() => handleCampaignDetailsClick(record.campaign_id)}style={{marginRight: "4px"}} type="primary">Details</Button>
              <Button  onClick={() => handleCampaignClick(record.campaign_id)} type="default">Edit</Button>
            </span>
          ),
        }
    ]
  )

}