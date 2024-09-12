import {query} from "../db";


class StatisticsService {
    private db: Function;

    constructor() {
        this.db = query;
    }
    
    public getBaseStatisics = async(email: string) => {
        const userEmail = email;
        let status;
        let statistics;
        let error = "";
        try {
            const status = await this.getCampaignStatusDetails(email);
            const statistics = await this.getCampaignStatistics(email);
        } catch(err) {
            error = err.message;
            status = {};
            statistics = {};
        } finally {
            return {
                error,
                status,
                statistics
            }
        }
    }

    private getCampaignStatistics = async(email: string) => {

        const result = await this.db(`
        SELECT cs.campaign_id, cs.views, cs.likes, cs.comments, cs.start_timestamp,
        cs.subscribers, cs.end_timestamp, cs.time_period
        FROM customers AS cu
        JOIN campaigns AS c ON cu.id = c.customer_id
        JOIN campaignstatistics AS cs ON c.campaign_id = cs.campaign_id
        WHERE cu.email = $1 ORDER BY cs.end_timestamp DESC;`, [email]);

        const currentTime = new Date();
        const sevenDaysAgo = new Date(currentTime.getTime() - 7 * 24 * 60 * 60 *1000);

        const lastDay = result.rows[0]; 
        const filteredArr = result.rows.filter(elem => {
            const itemDate = new Date(elem.end_timestamp);
            return itemDate > sevenDaysAgo;
        })
        const totalViewsValue = filteredArr.reduce( (sum, elem) => sum + elem.views, 0);
        const totalSubscribersValue = filteredArr.reduce( (sum, elem) => sum + elem.subscribers, 0);

        const groupedCampaignStatistics = this.getStatisticsByCampaignId(result.rows);

        return {
            views: {
                lastDay: lastDay?.views ?? 0,
                lastWeek: totalViewsValue ?? 0,
            }, 
            subscribers: {
                lastDay: lastDay?.subscribers ?? 0,
                lastWeek: totalSubscribersValue ?? 0
            },
            campaigns: groupedCampaignStatistics ?? {}
        }
    }

    private getCampaignStatusDetails = async (email) => {
        const queryUrl = `SELECT * FROM campaigns JOIN customers ON customers.id = campaigns.customer_id
         WHERE customers.email = $1 AND (campaigns.status = $2 OR campaigns.status = $3)`;
        let result  = await this.db(queryUrl, [email, 'active', 'setup']);

        const numberofActive = result.rows.filter(obj => obj.status === 'active').length;
        const numberofSetup = result.rows.filter(obj => obj.status === 'setup').length;

        return {numberofActive, numberofSetup};
    }

    private getStatisticsByCampaignId(arr: Array): Array {
        let groupedCampaigns = {};

        arr.forEach(element => {
           if(!(element.campaign_id in groupedCampaigns)) {
                groupedCampaigns[element.campaign_id] = [];
            } 
            groupedCampaigns[element.campaign_id].push(element);
        });
        return groupedCampaigns;
    }
}

export default StatisticsService;