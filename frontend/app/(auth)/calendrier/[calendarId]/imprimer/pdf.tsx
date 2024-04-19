import CommonPdf from "@/app/_components/pdf";
import { isCuid } from "@paralleldrive/cuid2";
import type { Calendar, Medicament } from "@prisma/client";
import { Rect, Svg, Text, View } from "@react-pdf/renderer";
import {
  addDays,
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfMonth,
  format,
  isBefore,
  isSameDay,
  startOfMonth,
} from "date-fns";
import { capitalize } from "lodash-es";
import { createTw } from "react-pdf-tailwind";

import type { UserSession } from "@plan-prise/auth/types";
import tailwind from "@plan-prise/tailwind-config";
import { cn } from "@plan-prise/ui/shadcn/lib/utils";

const PrintCalendar = ({
  calendar,
  medicaments,
  user,
}: {
  calendar: Calendar;
  medicaments: Medicament[];
  user: UserSession;
}) => {
  const tw = createTw(tailwind);
  let minDate: Date | null = null;
  let maxDate: Date | null = null;
  const events: Record<string, { denomination: string; quantity: string }[]> =
    {};

  for (const [id, data] of Object.entries(calendar.data ?? {})) {
    const denomination = isCuid(id)
      ? medicaments.find((medicament) => medicament.id === id)?.denomination ??
        ""
      : id;

    for (const recurrence of data) {
      const startDate = new Date(recurrence.startDate);
      const endDate = new Date(recurrence.endDate);

      // Set minDate
      if (!minDate) {
        minDate = new Date(recurrence.startDate);
      } else {
        if (startDate < minDate) {
          minDate = startDate;
        }
      }

      // Set endDate
      if (!maxDate) {
        maxDate = new Date(recurrence.endDate);
      } else {
        if (endDate > maxDate) {
          maxDate = endDate;
        }
      }

      for (
        let i = startDate;
        isBefore(i, endDate) || isSameDay(i, endDate);
        i = addDays(i, recurrence.frequency > 0 ? recurrence.frequency : 1)
      ) {
        const formatedDate = format(i, "yyyy-MM-dd");
        if (!events[formatedDate]) {
          events[formatedDate] = [];
        }

        events[formatedDate]?.push({
          denomination,
          quantity: recurrence.quantity,
        });
      }
    }
  }

  return (
    <CommonPdf
      header="Un calendrier pour vous aider à mieux prendre vos médicaments"
      footer={`Plan de prise n°${calendar.displayId} édité par ${user?.displayName ?? `${user?.firstName} ${user?.lastName}`} le ${new Date().toLocaleString(
        "fr-FR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        },
      )}`}
      orientation="portrait"
    >
      <View style={tw("flex flex-row")}>
        {eachMonthOfInterval({
          start: minDate ?? new Date(),
          end: maxDate ?? new Date(),
        }).map((month, index) => (
          <View
            key={index}
            style={tw("flex flex-wrap max-w-full")}
            wrap={false}
          >
            <View style={tw("w-[22rem] flex-initial shrink border mr-4")}>
              <Text style={tw("font-bold text-center")}>
                {capitalize(
                  month.toLocaleDateString("fr-FR", { month: "long" }),
                )}
              </Text>
            </View>
            {eachDayOfInterval({
              start: startOfMonth(month),
              end: endOfMonth(month),
            }).map((day, index) => (
              <View
                key={index}
                style={tw("w-[22rem] flex-initial shrink flex flex-row mr-4")}
                wrap={false}
              >
                <View style={tw("w-6 border border-t-0")}>
                  <Text
                    style={[
                      tw("font-bold text-center text-sm my-auto"),
                      { fontFamily: "Helvetica-Bold" },
                    ]}
                  >{`${day.getDate()}`}</Text>
                </View>
                <View
                  style={[
                    tw(
                      "flex-1 border border-solid border-l-0 border-t-0 p-1 text-base",
                    ),
                    { lineHeight: 1 },
                  ]}
                >
                  {(
                    events?.[format(day, "yyyy-MM-dd")]?.map((event) => ({
                      text: `${event.quantity} x ${event.denomination}`,
                      className: "text-sm",
                    })) ?? []
                  ).map((line, index) => (
                    <View
                      key={index}
                      style={tw(
                        cn("flex flex-row items-start", index !== 0 && "mt-2"),
                      )}
                    >
                      <Svg style={tw("h-5 w-5 mr-2")}>
                        <Rect
                          fill="none"
                          stroke="black"
                          width={12}
                          height={12}
                          x={1}
                          y={1}
                          rx={2}
                          ry={2}
                        />
                      </Svg>
                      <Text style={tw("text-sm w-80")}>{line.text}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </CommonPdf>
  );
};

export default PrintCalendar;
