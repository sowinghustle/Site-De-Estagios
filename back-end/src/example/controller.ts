import { Request, Response } from "express";

type Item = {
    title: string;
    description: string;
    number: string;
};

type ItemCollection = Item[];

let items: ItemCollection = [];

export function index(req: Request, res: Response) {
    return res.send({
        items,
    });
}

export function createItem(req: Request, res: Response) {
    const { title, description, number } = req.body;
    const item: Item = {
        title,
        description,
        number,
    };

    if (items.find((x) => x.number == item.number)) {
        return res.send({
            success: false,
            msg: "Item already created.",
        });
    }

    items.push(item);

    return res.send({ success: true });
}

export function getItem(req: Request, res: Response) {
    const id = req.params.id;
    const item = items.find((x) => x.number == id);

    if (item) {
        return res.send({
            success: true,
            item,
        });
    }

    return res.send({
        success: false,
        msg: "Item not found",
    });
}

export function updateItem(req: Request, res: Response) {
    const id = req.params.id;
    const index = items.findIndex((x) => x.number == id);

    if (index == -1) {
        return res.send({
            success: false,
            msg: "Item not found",
        });
    }

    const { title, description } = req.body;

    items[index] = {
        title: title ?? items.at(index)!.title,
        description: description ?? items.at(index)!.description,
        number: items.at(index)!.number,
    };

    return res.send({
        success: true,
    });
}

export function deleteItem(req: Request, res: Response) {
    const id = req.params.id;

    if (!items.find((x) => x.number == id)) {
        return res.send({
            success: false,
            msg: "Item not found",
        });
    }

    items = items.filter((x) => x.number != id);

    return res.send({
        success: true,
    });
}
